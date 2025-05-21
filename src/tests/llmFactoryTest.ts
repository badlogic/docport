import { LlmFactory } from '../llm/LlmFactory';
import { LlmModel } from '../llm/models';

// ANSI color codes for better visual logging
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

/**
 * Logs a section header with decoration
 */
function logHeader(title: string): void {
  console.log('\n' + colors.bright + colors.blue + '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓' + colors.reset);
  console.log(colors.bright + colors.blue + '▓ ' + colors.cyan + title + colors.blue + ' ▓' + colors.reset);
  console.log(colors.bright + colors.blue + '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓' + colors.reset);
}

/**
 * Logs a model initialization with details
 */
function logModelInit(provider: string, model: string, temperature: number): void {
  console.log(colors.green + '➤ Initializing' + colors.reset + colors.bright + ' ' + provider + colors.reset);
  console.log('  ' + colors.dim + '├─ Model:' + colors.reset + ' ' + model);
  console.log('  ' + colors.dim + '└─ Temperature:' + colors.reset + ' ' + temperature);
}

/**
 * Logs an error message
 */
function logError(message: string, error?: any): void {
  console.error(colors.red + '✖ ERROR: ' + colors.reset + message);
  if (error && error.message) {
    console.error('  ' + colors.dim + '└─ Details:' + colors.reset + ' ' + error.message);
  }
}

/**
 * Logs response details
 */
function logResponse(response: any): void {
  console.log(colors.green + '✓ Response received' + colors.reset);
  console.log('  ' + colors.dim + '├─ Content:' + colors.reset + ' ' + response.text);
  console.log('  ' + colors.dim + '└─ Token usage:' + colors.reset);
  console.log('    ' + colors.dim + '├─ Input:' + colors.reset + ' ' + response.usage.inputTokens);
  console.log('    ' + colors.dim + '├─ Output:' + colors.reset + ' ' + response.usage.outputTokens);
  console.log('    ' + colors.dim + '└─ Total:' + colors.reset + ' ' + response.usage.totalTokens);
}

/**
 * Tests a Gemini model
 */
async function testGeminiModel(): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    logError('GEMINI_API_KEY environment variable not set');
    return;
  }

  const temperature = 0.7;
  
  try {
    logModelInit('Gemini', LlmModel.GEMINI_1_5_PRO, temperature);

    // Create the LLM instance
    const geminiLlm = LlmFactory.create(
      LlmModel.GEMINI_1_5_PRO,
      apiKey,
      temperature
    );

    console.log(colors.yellow + '⟳ Sending request to Gemini...' + colors.reset);
    
    // Use the LLM instance
    const response = await geminiLlm.complete('Tell me a short joke about programming');
    logResponse(response);
    
  } catch (error) {
    logError('Failed to complete Gemini request', error);
  }
}

/**
 * Tests an OpenAI model
 */
async function testOpenAIModel(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY || '';
  if (!apiKey) {
    logError('OPENAI_API_KEY environment variable not set');
    return;
  }

  const temperature = 0.7;
  
  try {
    logModelInit('OpenAI', LlmModel.GPT_4O, temperature);

    // Create the LLM instance
    const openaiLlm = LlmFactory.create(
      LlmModel.GPT_4O,
      apiKey,
      temperature
    );

    console.log(colors.yellow + '⟳ Sending request to OpenAI...' + colors.reset);
    
    // Use the LLM instance
    const response = await openaiLlm.complete('Tell me a short joke about programming');
    logResponse(response);
    
  } catch (error) {
    logError('Failed to complete OpenAI request', error);
  }
}

/**
 * Tests an Anthropic model
 */
async function testAnthropicModel(): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY || '';
  if (!apiKey) {
    logError('ANTHROPIC_API_KEY environment variable not set');
    return;
  }

  const temperature = 0.7;
  
  try {
    logModelInit('Anthropic', LlmModel.CLAUDE_3_7_SONNET_20250219, temperature);

    // Create the LLM instance
    const anthropicLlm = LlmFactory.create(
      LlmModel.CLAUDE_3_7_SONNET_20250219,
      apiKey,
      temperature
    );

    console.log(colors.yellow + '⟳ Sending request to Anthropic...' + colors.reset);
    
    // Use the LLM instance
    const response = await anthropicLlm.complete('Tell me a short joke about programming');
    logResponse(response);
    
  } catch (error) {
    logError('Failed to complete Anthropic request', error);
  }
}

/**
 * Runs the tests based on command line arguments
 */
async function runTests(): Promise<void> {
  // Get command line args to determine which test to run
  const args = process.argv.slice(2);
  const runTest = args[0] || 'all';

  logHeader('LLM Factory Tests');
  console.log(colors.dim + 'Running tests for: ' + colors.reset + runTest);

  const startTime = Date.now();

  try {
    if (runTest === 'all' || runTest === 'gemini') {
      await testGeminiModel();
    }
    
    if (runTest === 'all' || runTest === 'openai') {
      await testOpenAIModel();
    }
    
    if (runTest === 'all' || runTest === 'anthropic') {
      await testAnthropicModel();
    }
  } catch (error) {
    logError('An unexpected error occurred', error);
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // in seconds
  
  logHeader('Test Summary');
  console.log(colors.dim + 'Duration: ' + colors.reset + `${duration.toFixed(2)} seconds`);
  console.log('\n' + colors.dim + 'Usage: ' + colors.reset + 'ts-node src/tests/llmFactoryTest.ts [gemini|openai|anthropic]');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}