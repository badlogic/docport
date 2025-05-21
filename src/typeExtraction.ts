import Parser from "tree-sitter";
import * as path from "path";

// Import parsers as needed
import CPP from "tree-sitter-cpp";
import CSharp from "tree-sitter-c-sharp";
import { readFile } from './fileUtils';
import { findFiles } from "./fileUtils";

// For Haxe and TypeScript, use TypeScript parser
// We use the appropriate parser for each language
import TSTypes from "tree-sitter-typescript";
const HaxeParser = TSTypes.typescript; // Use TypeScript parser for Haxe
const TypeScriptParser = TSTypes.typescript; // Use the typescript parser specifically

// Define the return type
export interface TypeInfo {
  types: string[];
  file: string;
}

/**
 * Extract defined types from source code
 * @param sourceDir Source directory
 * @returns Array of found types with their names and file paths
 */
export async function extractTypes(sourceDir: string): Promise<TypeInfo[]> {
  const files = await findFiles(
    sourceDir,
    (e) =>
      e.name.endsWith(".h") ||
      e.name.endsWith(".hpp") ||
      e.name.endsWith(".hxx") ||
      e.name.endsWith(".cs") ||
      e.name.endsWith(".hx") ||
      e.name.endsWith(".ts") ||
      e.name.endsWith(".tsx")
  );

  const types: TypeInfo[] = [];

  for (const filePath of files) {
    try {
      const sourceCode = await readFile(filePath);
      const fileTypes = extractTypesFromSourceCode(sourceCode, filePath);
      types.push(fileTypes);
    } catch (error) {
      console.error(`Error processing file ${filePath}: ${error}`);
    }
  }

  return types;
}

/**
 * Extract defined types from source code
 * @param sourceCode Source code content
 * @param filePath Path to the source file
 * @returns Array of found types with their names and file paths
 */
export function extractTypesFromSourceCode(
  sourceCode: string,
  filePath: string
): TypeInfo {
  const extension = path.extname(filePath).toLowerCase();

  // Skip non-header files for C/C++
  if (extension === ".c" || extension === ".cpp" || extension === ".cc") {
    return {
      types: [],
      file: filePath,
    };
  }

  // Preprocess source code for C/C++ headers to handle macros
  let processedCode = sourceCode;
  if (extension === ".h" || extension === ".hpp" || extension === ".hxx") {
    // Replace common macros that interfere with parsing
    processedCode = preprocessCppCode(sourceCode);
  }

  // Initialize parser based on file extension
  const parser = new Parser();
  switch (extension) {
    case ".h":
    case ".hpp":
    case ".hxx":
      parser.setLanguage(CPP); // Use C++ parser for headers
      break;
    case ".cs":
      parser.setLanguage(CSharp);
      break;
    case ".hx":
      // Use TypeScript parser as a fallback for Haxe
      parser.setLanguage(HaxeParser);
      break;
    case ".ts":
    case ".tsx":
      parser.setLanguage(TypeScriptParser);
      break;
    default:
      return {
        types: [],
        file: filePath,
      }; // Unsupported file type
  }

  try {
    // Parse with a large buffer size to handle big files
    const tree = parser.parse(processedCode, undefined, {
      bufferSize: 10 * 1024 * 1024, // 10MB buffer
    });

    // Extract type definitions based on language
    return extractTypesByLanguage(tree.rootNode, filePath, extension);
  } catch (error) {
    console.error(`Error parsing ${filePath}: ${error}`);
    return {
      types: [],
      file: filePath,
    };
  }
}

/**
 * Preprocess C++ code to remove problematic macros before parsing
 */
function preprocessCppCode(sourceCode: string): string {
  // Replace common macros that interfere with parsing
  let processed = sourceCode;

  // Replace SP_API and similar macros with empty string
  processed = processed.replace(/\bSP_API\b/g, '');
  processed = processed.replace(/\bSPINE_API\b/g, '');
  processed = processed.replace(/\bEXPORT\b/g, '');

  // Handle various macro patterns

  // 1. class SP_API ClassName : public BaseClass pattern
  processed = processed.replace(/class\s+\w+\s+(\w+)/g, 'class $1');

  // 2. struct SP_API StructName {...}
  processed = processed.replace(/struct\s+\w+\s+(\w+)/g, 'struct $1');

  // 3. Handle multiple inheritance with macros
  // Example: class SP_API AnimationState : public SpineObject, public HasRendererObject
  processed = processed.replace(/class\s+\w+\s+(\w+)\s*:\s*(public|private|protected)\s+([^,{]+),/g,
    'class $1 : $2 $3,');

  // 4. Handle multiple inheritance that might have macros in the base classes
  processed = processed.replace(/,\s*\w+\s+(public|private|protected)\s+(\w+)/g,
    ', $1 $2');

  return processed;
}

/**
 * Extract types based on language-specific node types
 */
function extractTypesByLanguage(
  rootNode: Parser.SyntaxNode,
  filePath: string,
  extension: string
): TypeInfo {
  switch (extension) {
    case ".h":
    case ".hpp":
    case ".hxx":
      // For C++ headers, use the tree-sitter AST approach with our extraction function
      return extractCppTypes(rootNode, filePath);
    case ".cs":
      // C# types, including namespace_declaration to look inside namespaces
      return extractTypesFromNodeTypes(rootNode, filePath, [
        "class_declaration",
        "interface_declaration",
        "enum_declaration",
        "struct_declaration",
        "namespace_declaration" // Added to ensure we search inside namespaces
      ]);
    case ".hx":
      // Haxe types - using TypeScript parser as fallback
      return extractTypesFromNodeTypes(rootNode, filePath, [
        "class_declaration",
        "interface_declaration",
        "enum_declaration",
        "type_alias_declaration",
      ]);
    case ".ts":
    case ".tsx":
      // TypeScript types - need to look for these inside export_statement nodes
      return extractTypesFromNodeTypes(rootNode, filePath, [
        "class_declaration",
        "interface_declaration",
        "enum_declaration",
        "type_alias_declaration",
        "export_statement",
      ]);
    default:
      return {
        types: [],
        file: filePath,
      };
  }
}

/**
 * Extract types from a C++ file by looking at identifiers
 */
function extractCppTypes(rootNode: Parser.SyntaxNode, filePath: string): TypeInfo {
  const types = new Set<string>();

  // Find all declarations of classes, structs, enums, and unions
  function findDeclarations(node: Parser.SyntaxNode) {
    // Only look at certain node types
    if (node.type === "class_specifier" ||
        node.type === "struct_specifier" ||
        node.type === "enum_specifier" ||
        node.type === "union_specifier") {
      // Skip forward declarations (those without bodies)
      const bodyNode = node.childForFieldName("body");
      if (bodyNode) {
        // Get the name
        const nameNode = node.childForFieldName("name");
        if (nameNode && nameNode.text) {
          types.add(nameNode.text);
        }
      }
    }
    // For typedef declarations
    else if (node.type === "typedef_declaration") {
      // First try standard approach (getting the type identifier)
      const identifiers = node.descendantsOfType("type_identifier");
      if (identifiers.length > 0) {
        // The last identifier is typically the typedef name
        const identifier = identifiers[identifiers.length - 1];
        if (identifier && !types.has(identifier.text)) {
          types.add(identifier.text);
        }
      }
      // If that doesn't work, look for identifier in declaration
      else {
        const declIds = node.descendantsOfType("identifier");
        if (declIds.length > 0) {
          // Get the last identifier as the typedef name
          const lastId = declIds[declIds.length - 1];
          if (lastId && !types.has(lastId.text)) {
            types.add(lastId.text);
          }
        }
      }
    }

    // Recursively search children
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) {
        findDeclarations(child);
      }
    }
  }

  // Start the traversal
  findDeclarations(rootNode);

  return {
    types: Array.from(types),
    file: filePath
  };
}

/**
 * Extract types using node type patterns (for non-C++ languages)
 */
function extractTypesFromNodeTypes(
  rootNode: Parser.SyntaxNode,
  filePath: string,
  typeNodeTypes: string[]
): TypeInfo {
  const seenNames = new Set<string>();

  // Find all nodes of specified types
  const typeNodes = findNodes(rootNode, typeNodeTypes);

  // Extract type names
  for (const node of typeNodes) {
    // Skip friend class declarations (they're not type definitions)
    if (isFriendDeclaration(node)) {
      continue;
    }

    // Skip namespace declarations themselves, we only want to traverse them
    if (node.type === "namespace_declaration" || node.type === "namespace_definition") {
      continue;
    }

    let extension = "";
    if (filePath.endsWith(".ts") || filePath.endsWith(".tsx") || filePath.endsWith(".hx")) {
      extension = ".ts";
    } else if (filePath.endsWith(".cs")) {
      extension = ".cs";
    }

    const name = getTypeName(node, extension);

    if (name) {
      seenNames.add(name);
    }
  }

  // Return a single TypeInfo object containing all types found in this file
  return {
    types: Array.from(seenNames),
    file: filePath,
  };
}

/**
 * Check if a node is a friend declaration (C/C++)
 */
function isFriendDeclaration(node: Parser.SyntaxNode): boolean {
  // Friend declarations start with 'friend'
  if (node.type === "declaration") {
    return node.text.trim().startsWith("friend");
  }

  // For friend class/struct declarations inside other classes
  if (node.type === "friend_declaration") {
    return true;
  }

  return false;
}

/**
 * Find nodes of specific types in the AST
 */
function findNodes(
  rootNode: Parser.SyntaxNode,
  types: string[]
): Parser.SyntaxNode[] {
  const nodes: Parser.SyntaxNode[] = [];

  function traverse(node: Parser.SyntaxNode) {
    // First check if this node is of a type we're interested in
    if (types.includes(node.type)) {
      // Special handling for namespace definitions - don't add them directly
      if (node.type === "namespace_definition" || node.type === "namespace_declaration") {
        // Only need to recurse and keep going, we'll process namespace contents below
      }
      // For C++ types, check if they're actual definitions (not forward declarations)
      else if (node.type === "struct_specifier" || node.type === "class_specifier") {
        const bodyNode = node.childForFieldName("body");
        // Skip if there's no body or if it's semicolon-terminated (forward declaration)
        if (bodyNode) {
          nodes.push(node);
        }
      }
      // Special handling for C++ classes with SP_API macro
      // These appear as function_definition with a class_specifier followed by an identifier
      else if (node.type === "function_definition") {
        const firstChild = node.child(0);
        if (firstChild && firstChild.type === "class_specifier") {
          // This is likely a class with a macro - add this instead
          nodes.push(node);
        }
      }
      // Special handling for classes with SP_API and multiple inheritance
      // These appear as declaration with a class_specifier and multiple identifiers
      else if (node.type === "declaration") {
        const firstChild = node.child(0);
        if (firstChild && firstChild.type === "class_specifier") {
          // This is likely a class with SP_API and multiple inheritance
          nodes.push(node);
        }
      } else {
        nodes.push(node);
      }
    }

    // Always recurse into children regardless of node type
    // This ensures we find all relevant nodes, including those inside namespaces
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) {
        traverse(child);
      }
    }
  }

  traverse(rootNode);
  return nodes;
}

/**
 * Extract type name from a node based on language
 */
function getTypeName(
  node: Parser.SyntaxNode,
  extension: string
): string | null {
  let nameNode: Parser.SyntaxNode | null = null;

  // Special handling for export statements in TypeScript
  if (
    node.type === "export_statement" &&
    (extension === ".ts" || extension === ".tsx" || extension === ".hx")
  ) {
    // For export statements, look at the declaration inside
    const declaration =
      node.descendantsOfType("interface_declaration")[0] ||
      node.descendantsOfType("class_declaration")[0] ||
      node.descendantsOfType("enum_declaration")[0] ||
      node.descendantsOfType("type_alias_declaration")[0];

    if (declaration) {
      // First try to get the name directly from the declaration
      if (declaration.type === "interface_declaration") {
        // Try to find the interface name right after 'interface' keyword
        const interfaceKw = declaration.descendantsOfType("interface")[0];
        if (interfaceKw && interfaceKw.nextNamedSibling) {
          return interfaceKw.nextNamedSibling.text;
        }
      } else if (declaration.type === "class_declaration") {
        // Try to find the class name right after 'class' keyword
        const classKw = declaration.descendantsOfType("class")[0];
        if (classKw && classKw.nextNamedSibling) {
          return classKw.nextNamedSibling.text;
        }
      }

      // If direct method doesn't work, use the regular getTypeName method
      const declName = getTypeName(declaration, extension);
      return declName;
    }
    return null;
  }

  switch (extension) {
    case ".h":
    case ".hpp":
    case ".hxx":
      // Special handling for C++ classes with SP_API macro
      if (node.type === "function_definition" || node.type === "declaration") {
        // First check if this is a class definition with a macro
        const firstChild = node.child(0);
        if (firstChild && firstChild.type === "class_specifier") {
          // This is a class with a macro like SP_API
          // Get the 2nd child which should be the actual class name
          const secondChild = node.child(1);
          if (secondChild && secondChild.type === "identifier") {
            return secondChild.text;
          }

          // If second child isn't an identifier (might be an ERROR node),
          // look for identifiers within that node
          if (secondChild) {
            const identifiers = secondChild.descendantsOfType("identifier");
            if (identifiers.length > 0) {
              return identifiers[0].text;
            }
          }

          // If we still can't find it, search all identifiers in the node
          const allIdentifiers = node.descendantsOfType("identifier");
          // Skip the first identifier if it's within the class_specifier (could be the macro)
          for (let i = 0; i < allIdentifiers.length; i++) {
            const id = allIdentifiers[i];
            // Skip identifiers contained within the class_specifier (would be the macro)
            if (!isDescendantOf(id, firstChild)) {
              // This is likely the class name
              return id.text;
            }
          }
        }
      }

      // C/C++ type name extraction
      if (node.type === "typedef_declaration") {
        // For typedefs, we want the new type name
        const identifier = node.descendantsOfType("type_identifier").pop();
        nameNode = identifier || null;
      } else {
        // For structs, classes, enums, unions
        // First try the standard way
        nameNode = node.childForFieldName("name");

        // If the standard way fails (which can happen with macros like SP_API),
        // try to find the name by inspecting the first identifier after the class/struct keyword
        if (!nameNode) {
          const classOrStructNode =
            node.descendantsOfType("class")[0] ||
            node.descendantsOfType("struct")[0] ||
            node.descendantsOfType("enum")[0] ||
            node.descendantsOfType("union")[0];

          if (classOrStructNode) {
            // Get all identifiers in the declaration
            const identifiers = node.descendantsOfType("identifier");

            if (identifiers.length > 0) {
              // Find the first identifier that's after the class/struct keyword
              for (const id of identifiers) {
                if (id.startPosition.row >= classOrStructNode.startPosition.row &&
                    id.startPosition.column > classOrStructNode.startPosition.column) {

                  // Skip identifiers that appear after a colon (indicating inheritance)
                  const colonOperator = node.descendantsOfType(":");
                  if (colonOperator.length > 0) {
                    if (id.startPosition.row > colonOperator[0].startPosition.row ||
                        (id.startPosition.row === colonOperator[0].startPosition.row &&
                         id.startPosition.column > colonOperator[0].startPosition.column)) {
                      continue;
                    }
                  }

                  nameNode = id;
                  break;
                }
              }
            }
          }
        }
      }

      // Helper function to check if a node is a descendant of another node
      function isDescendantOf(potentialDescendant: Parser.SyntaxNode, ancestor: Parser.SyntaxNode): boolean {
        let current = potentialDescendant.parent;
        while (current) {
          if (current === ancestor) return true;
          current = current.parent;
        }
        return false;
      }
      break;

    case ".cs":
      // C# specific handling
      // First try to get name directly from node
      nameNode = node.childForFieldName("name");

      // If that fails, look for identifier nodes
      if (!nameNode) {
        const identifiers = node.descendantsOfType("identifier");
        if (identifiers.length > 0) {
          // For class/interface/enum declarations, find the appropriate identifier
          // The structure for class is typically: 'modifier class identifier ...'
          if (node.type === "class_declaration") {
            // Find the identifier right after the "class" keyword
            const classKeyword = node.descendantsOfType("class")[0];
            if (classKeyword && classKeyword.nextNamedSibling) {
              nameNode = classKeyword.nextNamedSibling;
            } else {
              // Fallback to first identifier
              nameNode = identifiers[0];
            }
          } else if (node.type === "interface_declaration") {
            // Find the identifier right after the "interface" keyword
            const interfaceKeyword = node.descendantsOfType("interface")[0];
            if (interfaceKeyword && interfaceKeyword.nextNamedSibling) {
              nameNode = interfaceKeyword.nextNamedSibling;
            } else {
              // Fallback to first identifier
              nameNode = identifiers[0];
            }
          } else if (node.type === "enum_declaration") {
            // Find the identifier right after the "enum" keyword
            const enumKeyword = node.descendantsOfType("enum")[0];
            if (enumKeyword && enumKeyword.nextNamedSibling) {
              nameNode = enumKeyword.nextNamedSibling;
            } else {
              // Fallback to first identifier
              nameNode = identifiers[0];
            }
          } else if (node.type === "struct_declaration") {
            // Find the identifier right after the "struct" keyword
            const structKeyword = node.descendantsOfType("struct")[0];
            if (structKeyword && structKeyword.nextNamedSibling) {
              nameNode = structKeyword.nextNamedSibling;
            } else {
              // Fallback to first identifier
              nameNode = identifiers[0];
            }
          } else {
            // Fallback to first identifier for other types
            nameNode = identifiers[0];
          }
        }
      }
      break;

    case ".hx":
    case ".ts":
    case ".tsx":
      // Haxe, TypeScript
      if (node.type === "type_alias_declaration") {
        // For type aliases, find the identifier (name is right after 'type' keyword)
        const typeKw = node.descendantsOfType("type")[0];
        if (typeKw) {
          const nextSibling = typeKw.nextNamedSibling;
          if (nextSibling && nextSibling.type === "type_identifier") {
            nameNode = nextSibling;
          }
        }
      } else if (node.type === "interface_declaration") {
        // For interfaces, use different approaches to find the name
        // Try to get direct identifier first
        nameNode = node.childForFieldName("name");

        // If that fails, try to find any identifier after 'interface' keyword
        if (!nameNode) {
          const identifiers = node.descendantsOfType("identifier");
          if (identifiers.length > 0) {
            // Get the first identifier after the 'interface' keyword
            const interfaceKw = node.descendantsOfType("interface")[0];
            if (interfaceKw) {
              for (const id of identifiers) {
                if (
                  id.startPosition.row >= interfaceKw.startPosition.row &&
                  id.startPosition.column > interfaceKw.startPosition.column
                ) {
                  nameNode = id;
                  break;
                }
              }
            }
            // If still not found, just take the first identifier
            if (!nameNode) {
              nameNode = identifiers[0];
            }
          }
        }
      } else if (node.type === "class_declaration") {
        // For classes, use multiple approaches to find the name
        // Try to get direct identifier first
        nameNode = node.childForFieldName("name");

        // If that fails, try to find any identifier after 'class' keyword
        if (!nameNode) {
          const identifiers = node.descendantsOfType("identifier");
          if (identifiers.length > 0) {
            // Get the first identifier after the 'class' keyword
            const classKw = node.descendantsOfType("class")[0];
            if (classKw) {
              for (const id of identifiers) {
                if (
                  id.startPosition.row >= classKw.startPosition.row &&
                  id.startPosition.column > classKw.startPosition.column
                ) {
                  nameNode = id;
                  break;
                }
              }
            }
            // If still not found, just take the first identifier
            if (!nameNode) {
              nameNode = identifiers[0];
            }
          }
        }
      } else if (node.type === "enum_declaration") {
        // For enums, try multiple approaches to find the name
        // First try to get the name directly
        nameNode = node.childForFieldName("name");

        if (!nameNode) {
          // Try to find the identifier right after 'enum' keyword
          const enumKw = node.descendantsOfType("enum")[0];
          if (enumKw) {
            const nextSibling = enumKw.nextNamedSibling;
            if (nextSibling && nextSibling.type === "identifier") {
              nameNode = nextSibling;
            } else {
              // If we can't find it that way, just get the first identifier
              const identifiers = node.descendantsOfType("identifier");
              if (identifiers.length > 0) {
                nameNode = identifiers[0];
              }
            }
          }
        }
      }
      break;
  }

  return nameNode ? nameNode.text : null;
}