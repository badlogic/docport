import chalk from 'chalk';
import { readFile } from './fileUtils';
import { transferJavadocsToSourceFile } from './javadocTransfer';
import { LlmFactory } from './llm/LlmFactory';
import { LlmModel } from './llm/models';

async function main() {
  const filePath = process.argv[2];
  const javadocsPath = "./javadocs.json";
  const model = LlmModel.CLAUDE_3_7_SONNET_LATEST;

  if (!filePath) {
    console.error(chalk.red("Please provide a file path to test"));
    process.exit(1);
  }

  const llm = LlmFactory.create(model);
  const javadocsJson = await readFile(javadocsPath);
  const javaTypes = JSON.parse(javadocsJson);

  const usage = await transferJavadocsToSourceFile(filePath, javaTypes, llm, [], true);
  console.log(chalk.green(`Tokens used: ${usage.totalTokens.toLocaleString()} (${usage.inputTokens.toLocaleString()} input, ${usage.outputTokens.toLocaleString()} output)`));
}

main().catch(error => {
  console.error(chalk.red.bold("❌ Error:"), chalk.red(error.message));
  process.exit(1);
});