import { LlmFactory } from '../llm/LlmFactory';
import { LlmModel } from '../llm/models';

// Example of how to use the LlmFactory for Gemini models
function testGeminiModel(): void {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable not set');
    return;
  }

  // Use a specific Gemini model (we'll use the 1.5 Pro model)
  const geminiLlm = LlmFactory.create(
    LlmModel.GEMINI_1_5_PRO,
    apiKey,
    0.7 // temperature
  );

  console.log(`\nUsing model: ${geminiLlm.getName()} - ${geminiLlm.getModel()}`);

  // Use the LLM instance
  geminiLlm.complete('Tell me a short joke about programming').then(response => {
    console.log(`Response: ${response.text}`);
    console.log(`Input tokens: ${response.usage.inputTokens}`);
    console.log(`Output tokens: ${response.usage.outputTokens}`);
    console.log(`Total tokens: ${response.usage.totalTokens}`);
  }).catch(error => {
    console.error('Error:', error.message);
  });
}

// Example of how to use the LlmFactory for OpenAI models
function testOpenAIModel(): void {
  const apiKey = process.env.OPENAI_API_KEY || '';
  if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable not set');
    return;
  }

  // Use a specific OpenAI model (we'll use GPT-4o)
  const openaiLlm = LlmFactory.create(
    LlmModel.GPT_4O,
    apiKey,
    0.7, // temperature
    false // jsonMode
  );

  console.log(`\nUsing model: ${openaiLlm.getName()} - ${openaiLlm.getModel()}`);

  // Use the LLM instance
  openaiLlm.complete('Tell me a short joke about programming').then(response => {
    console.log(`Response: ${response.text}`);
    console.log(`Input tokens: ${response.usage.inputTokens}`);
    console.log(`Output tokens: ${response.usage.outputTokens}`);
    console.log(`Total tokens: ${response.usage.totalTokens}`);
  }).catch(error => {
    console.error('Error:', error.message);
  });
}

// Run tests if this file is executed directly
if (require.main === module) {
  // Choose which test to run by uncommenting one of these:
  testGeminiModel();
  testOpenAIModel();

  console.log('\nTo run tests with a specific model, uncomment one of the test functions in the source code.');
}