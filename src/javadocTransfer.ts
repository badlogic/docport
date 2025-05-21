import chalk from "chalk";
import path from "path";
import { findFiles, readFile, writeFile } from "./fileUtils";
import { JavaEnumConstant, JavaMember, JavaType } from "./javadocExtraction";
import { LlmInterface, LlmUsage } from "./llm/LlmInterface";
import { extractTypesFromSourceCode } from "./typeExtraction";

export async function transferJavadocs(
	runtimeDir: string,
	javaTypes: JavaType[],
	llm: LlmInterface,
	debug = false
): Promise<LlmUsage> {
	console.log(chalk.magenta.bold(`\n🔄 Transferring Javadocs to target runtime: ${runtimeDir}`));

	// Find all source files in the target runtime
	const sourceExtensions = [".cs", ".cpp", ".c", ".h", ".hpp", ".js", ".ts", ".as", ".hx"];
	const sourceFiles = await findFiles(runtimeDir, (entry) => {
		const ext = path.extname(entry.name).toLowerCase();
		return sourceExtensions.includes(ext);
	});

	console.log(chalk.magenta(`Found ${sourceFiles.length} source files to process\n`));

	const tokenStats = {
		inputTokens: 0,
		outputTokens: 0,
		totalTokens: 0,
	};

	let processedFiles = 0;
	let errorCount = 0;
	const startTime = new Date();

	for (const filePath of sourceFiles) {
		try {
			const filename = path.basename(filePath);
			console.log(
				chalk.cyan.bold(`📄 Processing file (${processedFiles + 1}/${sourceFiles.length}): ${filename}`)
			);

			const usage = await transferJavadocsToSourceFile(filePath, javaTypes, llm, debug);
			tokenStats.inputTokens += usage.inputTokens;
			tokenStats.outputTokens += usage.outputTokens;
			tokenStats.totalTokens += usage.totalTokens;

			processedFiles++;

			const elapsed = (new Date().getTime() - startTime.getTime()) / 1000;
			const averageTimePerFile = elapsed / processedFiles;
			const estimatedTimeRemaining = averageTimePerFile * (sourceFiles.length - processedFiles);
			const remainingTimeFormatted = formatTime(estimatedTimeRemaining);

			console.log(
				chalk.gray(
					`  ├─ Progress: ${processedFiles}/${sourceFiles.length} files (${(
						(processedFiles / sourceFiles.length) *
						100
					).toFixed(1)}%)`
				)
			);
			console.log(
				chalk.gray(
					`  ├─ Tokens: ${tokenStats.inputTokens.toLocaleString()} in, ${tokenStats.outputTokens.toLocaleString()} out`
				)
			);
			console.log(chalk.gray(`  └─ ETA: ${remainingTimeFormatted} remaining\n`));
		} catch (error) {
			errorCount++;
			console.error(chalk.red(`  ⚠️  Error processing ${filePath}: ${(error as Error).message}\n`));
		}
	}

	return tokenStats;
}

export async function transferJavadocsToSourceFile(
	filePath: string,
	javaTypes: JavaType[],
	llm: LlmInterface,
	debug = false
): Promise<LlmUsage> {
	let usage: LlmUsage = {
		inputTokens: 0,
		outputTokens: 0,
		totalTokens: 0,
	};

	try {
		// Read the source file
		const sourceCode = await readFile(filePath);

		// Step 1: Extract types from the source file
		console.log(chalk.cyan(`  ├─ Extracting types...`));
		const extractedTypeInfo = extractTypesFromSourceCode(sourceCode, filePath);
		const sourceTypes = extractedTypeInfo.types;

		if (sourceTypes.length > 0) {
			console.log(chalk.green(`  │  ✓ Found ${sourceTypes.length} types: ${sourceTypes.join(", ")}`));
		} else {
			console.log(chalk.yellow(`  │  ⚠️  No types found in file`));
			return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
		}

		// Step 2: Map source types to Java types
		console.log(chalk.cyan(`  ├─ Mapping types to Java...`));
		const javaTypesSummary = createJavaTypesSummary(javaTypes);
		const typeMappingPrompt = createTypeMappingPrompt(sourceTypes, javaTypesSummary, filePath);

		if (debug) await writeFile("./type-mapping-prompt.txt", typeMappingPrompt);
		const mappingResponse = await llm.complete(typeMappingPrompt);
		usage = addUsage(usage, mappingResponse.usage);

		const typeMapping = parseJsonResponse<string>(mappingResponse.text);
		console.log(chalk.green(`  │  ✓ Found ${Object.keys(typeMapping).length} matches`));

		// Debug mappings
		for (const javaType of typeMapping) {
			console.log(chalk.gray(`  │    └─ ${javaType}`));
		}

		// Step 3: Filter javadocs to only include relevant types
		let filteredJavaTypes: MinimalJavaType[];
		if (typeMapping.length > 0) {
			console.log(chalk.cyan(`  ├─ Filtering Java types to only include relevant types...`));
			filteredJavaTypes = filterJavaTypes(javaTypes, typeMapping);
			console.log(chalk.green(`  │  ✓ Filtered Java types contains ${filteredJavaTypes.length} types`));
			if (filteredJavaTypes.length === 0) {
				console.log(chalk.yellow(`  │  ⚠️  No Java types matched the mapped types.`));
				return usage;
			}
		} else {
			console.log(chalk.yellow(`  │  ⚠️  No type mappings found.`));
			return usage;
		}

		console.log(chalk.cyan(`  ├─ Generating documentation...`));
		let iterations = 0;
		const maxIterations = 5;
		let updatedCode = sourceCode;
		do {
			// Step 4: Generate documentation edits
			console.log(chalk.gray(`  │  └─ Pass ${iterations + 1}/${maxIterations}`));
			console.log(chalk.gray(`  │      ├─ Generating documentation edits...`));
			const prompt = createDocumentationPrompt(updatedCode, filteredJavaTypes, filePath);
			if (debug) await writeFile("./doc-prompt.txt", prompt);
			const response = await llm.complete(prompt);
			usage = addUsage(usage, response.usage);
			if (debug) await writeFile("./doc-response.txt", response.text);
			printUsage(response.usage);

			// Apply initial edits
			const edits = parseJsonResponse<{ oldString: string; newString: string }>(response.text);
			updatedCode = await applyEdits(edits, updatedCode, debug);
			await writeFile(filePath, updatedCode);
			if (edits.length === 0 || edits.every(edit => edit.oldString === edit.newString)) break;

			// Step 5: Correction phase
			console.log(chalk.gray(`  │      ├─ Checking for documentation errors...`));
			const correctionPrompt = createCorrectionPrompt(updatedCode, filePath);
			if (debug) await writeFile("./correction-prompt.txt", correctionPrompt);
			const correctionResponse = await llm.complete(correctionPrompt);
			usage = addUsage(usage, correctionResponse.usage);
			if (debug) await writeFile("./correction-response.txt", correctionResponse.text);
			printUsage(correctionResponse.usage);

			// Apply correction edits
			const corrections = parseJsonResponse<{ oldString: string; newString: string }>(correctionResponse.text);
			updatedCode = await applyEdits(corrections, updatedCode, debug);
			await writeFile(filePath, updatedCode);
			if (corrections.length === 0 || corrections.every(edit => edit.oldString === edit.newString)) break;
		} while (++iterations < maxIterations);

		console.log(chalk.green(`  └─ ✓ Complete\n`));
		// Write final result
		return usage;
	} catch (error) {
		console.error(chalk.red(`  └─ ❌ Error: ${(error as Error).message}\n`));
		return usage;
	}
}

/**
 * Process LLM response, extract edits, and apply them to the source code
 */
async function applyEdits(
	edits: { oldString: string; newString: string }[],
	sourceCode: string,
	debug = false
): Promise<string> {
	console.log(chalk.gray(`  │      │  └─ Applying ${edits.length} edits`));
	let updatedCode = sourceCode;
	let appliedEdits = 0;
	let skippedEdits = 0;

	for (const edit of edits) {
		if (!edit.oldString || edit.newString === undefined) {
			console.log(chalk.yellow(`  │      │      ⚠️  Skipping invalid edit`));
			skippedEdits++;
			continue;
		}

		if (edit.oldString === edit.newString) {
			console.log(chalk.yellow(`  │      │      ⚠️  Skipping edit with no changes`));
			skippedEdits++;
			continue;
		}

		// Validate that oldString exists in the current code
		if (!updatedCode.includes(edit.oldString)) {
			console.log(chalk.yellow(`  │      │      ⚠️  Old string not found in source:`));
			console.log(chalk.gray(`───────────────────────────────────────────────────`));
			console.log(edit.oldString);
			console.log(chalk.gray(`───────────────────────────────────────────────────`));
			skippedEdits++;
			continue;
		}

		// Apply the edit
		updatedCode = updatedCode.replace(edit.oldString, edit.newString);
		if (debug) console.log(chalk.gray(`  │      │      └─ ${edit.oldString.split("\n")[0]}...`));
		appliedEdits++;
	}

	console.log(chalk.green(`  │      │      ✓ Applied ${appliedEdits}/${edits.length} edits`));
	return updatedCode;
}

/**
 * Create a prompt for mapping source types to Java types
 */
function createTypeMappingPrompt(sourceTypes: string[], javadocSummary: any[], filePath: string): string {
	const fileExtension = path.extname(filePath);
	const fileName = path.basename(filePath);
	const language = getLanguageName(fileExtension);

	return `
# Task: Map ${language} Types to Java Types

## Source Types
I need to find the Java equivalents for these ${language} types from file '${fileName}':
\`\`\`
${sourceTypes.join("\n")}
\`\`\`

## Java Structure Summary
This is a summary of all Java types:

\`\`\`json
${JSON.stringify(javadocSummary, null, 2)}
\`\`\`

## Task: Identify Matching Java Types

Analyze the source types and find their matching Java counterparts. There may not be a 1:1 mapping for every type.
For each source type, determine the fully qualified Java type name (if a match exists).

Rules for matching:
1. Match based on type name similarity (exact matches are ideal)
2. Consider name variations between languages (e.g., camelCase vs PascalCase)
4. Some source types might not have Java counterparts (these can be omitted)

Return ONLY a JSON array of fully qualified Java type names that are relevant to the source types:

\`\`\`json
[
  "com.example.package.JavaType1",
  "com.example.package.JavaType2"
]
\`\`\`

DO NOT include any explanation or additional text - just the JSON array.
`;
}

type MinimalJavaType = {
	fullName: string;
	javadoc: string;
	members: JavaMember[];
	enumConstants: JavaEnumConstant[];
};

/**
 * Filter javadocs to only include types in the mapping, and flatten nested types.
 * Returns minimal JavaType objects with just fullName, javadoc, members and enumConstants.
 */
function filterJavaTypes(javaTypes: JavaType[], javaTypesToInclude: string[]): MinimalJavaType[] {
	console.log(chalk.gray(`  │  └─ Filtering for these Java types: ${javaTypesToInclude.join(", ")}`));
	const typesToInclude = new Set(javaTypesToInclude);

	function findMatchingTypes(docs: JavaType[]): MinimalJavaType[] {
		const matches: MinimalJavaType[] = [];

		for (const doc of docs) {
			if (doc.fullName && typesToInclude.has(doc.fullName)) {
				matches.push({
					fullName: doc.fullName,
					javadoc: doc.javadoc,
					members: doc.members,
					enumConstants: doc.enumConstants || [],
				});
			}

			if (doc.nestedTypes && doc.nestedTypes.length > 0) {
				matches.push(...findMatchingTypes(doc.nestedTypes));
			}
		}

		return matches;
	}

	const filtered = findMatchingTypes(javaTypes);
	console.log(chalk.gray(`  │  └─ Found ${filtered.length} matching types after filtering`));
	return filtered;
}

/**
 * Creates a summary of Javadocs with just the essential information
 * This reduces token usage while still providing enough context
 */
function createJavaTypesSummary(javadocs: JavaType[]) {
	const summary: Array<{ name: string; type: string }> = [];
	for (const doc of javadocs) {
		if (doc.fullName) {
			summary.push({
				name: doc.fullName,
				type: doc.type,
			});
		}
		if (doc.nestedTypes) {
			summary.push(...createJavaTypesSummary(doc.nestedTypes));
		}
	}
	return summary;
}

/**
 * Creates a prompt requesting all documentation edits at once
 */
function createDocumentationPrompt(sourceCode: string, javaTypes: MinimalJavaType[], filePath: string): string {
	const fileExtension = path.extname(filePath);
	const fileName = path.basename(filePath);

	return `
# Task: Transfer Documentation from Java to ${getLanguageName(fileExtension)} Source File (${fileName})

## Source Code
\`\`\`${getLanguageIdentifier(fileExtension)}
${sourceCode}
\`\`\`

## Java Documentation
Below is the relevant Java documentation for this codebase. Use this to add and update documentation in the source file:

\`\`\`json
${JSON.stringify(javaTypes, null, 2)}
\`\`\`

## Documentation Style for ${getLanguageName(fileExtension)}
${getDocumentationStyle(fileExtension)}

## Task: Generate Documentation Edits

Your task is to identify elements in the source code that need documentation and create edits to add and update that documentation.

For EACH element that needs documentation:
1. Identify the source element (class, method, property, etc.)
2. Find the matching Java documentation
3. Generate documentation in the appropriate style for ${getLanguageName(fileExtension)}
4. Output an edit with "oldString" (original code) and "newString" (with documentation added or updated)

CRITICAL REQUIREMENTS:
- NEVER modify actual code - only add or update documentation comments
- UPDATE the existing documentation if it already exists
- Include enough context in "oldString" to ensure a unique match
- Follow the target language's documentation style guide
- Only add documentation for elements that have corresponding Java documentation
- DO NOT add parameter documentation if the Java doc doesn't include it
- DO NOT add return documentation if the Java doc doesn't include it
- DO NOT duplicate documentation
- PRESERVE the exact indentation of the original code
- MATCH the indentation of documentation comments to the code they document

Return your response as a JSON array of edit objects:

\`\`\`json
[
  {
    "oldString": "    public class Skeleton {",
    "newString": "    /// <summary>\\n    /// Stores and manipulates the bones of a skeleton.\\n    /// </summary>\\n    public class Skeleton {"
  },
  {
    "oldString": "        public Bone FindBone(string boneName) {",
    "newString": "        /// <summary>\\n        /// Finds a bone by its name.\\n        /// </summary>\\n        /// <param name=\\"boneName\\">The name of the bone to find.</param>\\n        /// <returns>The bone, or null if not found.</returns>\\n        public Bone FindBone(string boneName) {"
  }
]
\`\`\`

Only return the JSON array - no other text. Include ALL needed edits in a single response.
`;
}

/**
 * Parses a JSON response from the LLM, handling markdown code blocks and escaping
 * @param responseText The raw response text from the LLM
 * @returns Parsed JSON array
 */
function parseJsonResponse<T>(responseText: string): T[] {
	try {
		// Clean up response if it contains markdown or other text
		let jsonText = responseText;

		if (responseText.includes("```")) {
			const match = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
			if (match && match[1]) {
				jsonText = match[1];
			}
		}

		// Escape control characters in JSON string literals
		jsonText = jsonText.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
			return match.replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
		});

		// Parse the JSON
		const result = JSON.parse(jsonText);
		if (!Array.isArray(result)) {
			throw new Error("Expected an array in response");
		}
		return result;
	} catch (error) {
		console.error(chalk.red(`Error parsing JSON response: ${error}`));
		console.error(chalk.yellow(`Response was:\n${responseText}\n--------------------------------\n`));
		return [];
	}
}

function getLanguageName(fileExtension: string): string {
	switch (fileExtension) {
		case ".cs":
			return "C#";
		case ".cpp":
			return "C++";
		case ".c":
			return "C";
		case ".h":
		case ".hpp":
			return "C/C++ Header";
		case ".js":
			return "JavaScript";
		case ".ts":
			return "TypeScript";
		case ".as":
			return "ActionScript";
		case ".hx":
			return "Haxe";
		default:
			return "Unknown";
	}
}

function getLanguageIdentifier(fileExtension: string): string {
	switch (fileExtension) {
		case ".cs":
			return "csharp";
		case ".cpp":
			return "cpp";
		case ".c":
			return "c";
		case ".h":
		case ".hpp":
			return "cpp";
		case ".js":
			return "javascript";
		case ".ts":
			return "typescript";
		case ".as":
			return "actionscript";
		case ".hx":
			return "haxe";
		default:
			return "";
	}
}

function getDocumentationStyle(fileExtension: string): string {
	switch (fileExtension) {
		case ".cs":
			return `
Use XML documentation comments (///) for C# code:
- Place comments directly above the entity being documented
- Use <summary> for general descriptions
- Use <param name="paramName"> for parameters
- Use <returns> for return values
- Use <exception cref="ExceptionType"> for exceptions (use full type name)
- Use <remarks> for additional information
- Use <see cref="TypeName"/> to reference types
- Use <seealso cref="TypeName"/> for related types

Example:
/// <summary>
/// Stores and manipulates the bones of a skeleton.
/// </summary>
/// <seealso cref="Bone"/>
public class Skeleton {
    /// <summary>
    /// Finds a bone by its name.
    /// </summary>
    /// <param name="boneName">The name of the bone to find.</param>
    /// <returns>The <see cref="Bone"/>, or null if not found.</returns>
    /// <exception cref="ArgumentNullException">When boneName is null.</exception>
    public Bone FindBone(string boneName) { ... }
}`;

		case ".cpp":
		case ".c":
		case ".h":
		case ".hpp":
			return `
Use Doxygen-style comments for C/C++ code:
- Use /** ... */ for single and multi-line documentation
- Do not use /// for documentation
- Place comments directly above the entity being documented
- Use @brief for short descriptions
- Use @param [in/out] paramName for parameters
- Use @return for return values
- Use @throws for exceptions
- Use @details for additional information
- Use @see ClassName for related types
- Use @ref ClassName for inline class references
- Use @ref ClassName::methodName(ParamType) for method references
- Use @sa (see also) for related references
- Use @relates ClassName for related non-member functions

Example:
/**
 * @brief Stores and manipulates the bones of a skeleton.
 * @see Bone
 * @sa BoneAnimation
 */
class Skeleton {
    /**
     * @brief Finds a bone by its name.
     * @param[in] boneName The name of the bone to find.
     * @return The @ref Bone pointer, or nullptr if not found.
     * @throws std::invalid_argument When boneName is null.
     * @details See @ref Timeline::apply(Skeleton*, float, float, Array*, float, MixBlend, MixDirection)
     *          for related functionality.
     */
    Bone* findBone(const char* boneName) { ... }
};`;

		case ".js":
		case ".ts":
			return `
Use JSDoc comments for JavaScript/TypeScript code:
- Use /** ... */ format
- Place comments directly above the entity being documented
- Use @description or the first line for general descriptions
- Use @param {type} paramName - description for parameters
- Use @returns {type} description for return values
- Use @throws {type} description for exceptions
- Use {@link ClassName} for inline references
- Use @see ClassName for related type references

Example:
/**
 * Stores and manipulates the bones of a skeleton.
 * @see Bone
 */
class Skeleton {
    /**
     * Finds a bone by its name.
     * @param {string} boneName - The name of the bone to find.
     * @returns {Bone|null} The {@link Bone}, or null if not found.
     * @throws {Error} When boneName is null.
     */
    findBone(boneName) { ... }
}`;

		case ".hx":
			return `
Use documentation comments for Haxe code:
- Use /** ... */ format
- Place comments directly above the entity being documented
- Use @param paramName description for parameters
- Use @return description for return values
- Use @throws Type description for exceptions

Example:
/**
 * Stores and manipulates the bones of a skeleton.
 */
class Skeleton {
    /**
     * Finds a bone by its name.
     * @param boneName The name of the bone to find.
     * @return The bone, or null if not found.
     */
    public function findBone(boneName:String):Bone { ... }
}`;

		default:
			return `Use appropriate documentation style for this language.`;
	}
}

/**
 * Formats seconds into a human-readable time string (HH:MM:SS)
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	return [
		hours.toString().padStart(2, "0"),
		minutes.toString().padStart(2, "0"),
		secs.toString().padStart(2, "0"),
	].join(":");
}

function createCorrectionPrompt(sourceCode: string, filePath: string): string {
	const fileExtension = path.extname(filePath);
	return `
# Task: Fix Documentation Errors

## Source Code
\`\`\`${getLanguageIdentifier(fileExtension)}
${sourceCode}
\`\`\`

## Documentation Style for ${getLanguageName(fileExtension)}
${getDocumentationStyle(fileExtension)}

## Fix Documentation Issues
Analyze the source code and fix these specific documentation issues:
1. Remove any duplicate documentation comments
2. Fix any syntax errors in comments (e.g., unclosed block comments, escaped characters)
3. DO NOT add any new documentation

Return ONLY a JSON array of correction edits. Each edit should fix ONE specific issue:

\`\`\`json
[
  {
    "oldString": "The exact string containing the error",
    "newString": "The corrected string"
  }
]
\`\`\`

Focus ONLY on fixing documentation errors - do not modify or add new documentation content.
`;
}

function addUsage(current: LlmUsage, additional: LlmUsage): LlmUsage {
	return {
		inputTokens: current.inputTokens + additional.inputTokens,
		outputTokens: current.outputTokens + additional.outputTokens,
		totalTokens: current.totalTokens + additional.totalTokens,
	};
}

function printUsage(usage: LlmUsage): void {
	console.log(
		chalk.gray(
			`  │      │  Tokens used: ${usage.totalTokens.toLocaleString()} (${usage.inputTokens.toLocaleString()} input, ${usage.outputTokens.toLocaleString()} output)`
		)
	);
}
