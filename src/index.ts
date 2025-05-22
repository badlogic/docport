#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { writeFile } from "./fileUtils";
import { extractJavadocs } from "./javadocExtraction";
import { LlmFactory } from "./llm/LlmFactory";
import { LlmModel } from "./llm/models";
import { transferJavadocs } from "./javadocTransfer";

const program = new Command();

program
  .name("docport")
  .description("A tool to transfer Javadocs to source files in other languages")
  .version("1.0.0");

program
  .option("-j, --javadocs <path>", "Source directory containing Java files with Javadocs")
  .option("-r, --runtime <path>", "Source directory containing target runtime to transfer Javadocs to")
  .option("-m, --model <model>", "LLM model to use (only for LLM parser)", LlmModel.CLAUDE_3_7_SONNET_LATEST)
  .option("-t, --temperature <temperature>", "LLM temperature (only for LLM parser)", "0.7")
  .option("-k, --key <key>", "LLM API key (only for LLM parser)", undefined)
  .action(async (options: { javadocs: string, runtime: string, model: string, temperature: string, key?: string }) => {
    const startTime = Date.now();
    try {
      if (!options.javadocs) {
        throw new Error("Javadocs directory (--javadocs) is required");
      }
      if (!options.runtime) {
        throw new Error("Runtime directory (--runtime) is required");
      }

      // Process Javadocs and get documentation structure
      const javadocs = await processJavadocs(options.javadocs);

      // Create LLM instance
      const llm = LlmFactory.create(
        options.model as LlmModel,
        options.key,
        parseFloat(options.temperature)
      );

      // Transfer Javadocs to target runtime
      const result = await transferJavadocs(options.runtime, javadocs, llm);
      console.log(chalk.green(`✓ Logs: ${result.logs.length}`));
      // Output info logs first
      for (const log of result.logs.filter(l => l.level === "info")) {
        console.log(chalk.yellow(`  └─ ${log.message}`));
      }
      // Then output error logs in red
      for (const log of result.logs.filter(l => l.level === "error")) {
        console.log(chalk.red(`  └─ ${log.message}`));
      }
      console.log(chalk.green(`✓ Tokens used: ${result.tokenStats.totalTokens.toLocaleString()} (${result.tokenStats.inputTokens.toLocaleString()} input, ${result.tokenStats.outputTokens.toLocaleString()} output)`));

      // Add execution time output
      const executionTime = (Date.now() - startTime) / 1000;
      console.log(chalk.green(`✓ Execution time: ${executionTime.toFixed(2)} seconds`));
    } catch (error) {
      console.error(chalk.red.bold("❌ Error:"), chalk.red((error as Error).message));
      process.exit(1);
    }
  });

program.parse();


async function processJavadocs(source: string) {
  console.log(chalk.blue(`Processing Javadocs from: ${source}`));
  const types = await extractJavadocs(source);

  // Count all types including nested types
  let totalTypes = 0;

  // Recursive function to count a type and all its nested types
  function countTypesRecursively(type: any): number {
    let count = 1; // Count this type

    // Count all nested types if they exist
    if (type.nestedTypes && type.nestedTypes.length > 0) {
      type.nestedTypes.forEach((nestedType: any) => {
        count += countTypesRecursively(nestedType);
      });
    }

    return count;
  }

  // Count all types
  types.forEach(type => {
    totalTypes += countTypesRecursively(type);
  });

  const fileCount = new Set(types.map(t => t.sourcePath)).size;

  console.log(chalk.green(`✓ Found ${totalTypes} types in ${fileCount} files`));
  writeFile("./javadocs.json", JSON.stringify(types, null, 2));
  console.log(chalk.green(`✓ Wrote Javadocs to javadocs.json`));
  return types;
}