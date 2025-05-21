#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL_JSON_URL = 'https://raw.githubusercontent.com/crmne/ruby_llm/main/lib/ruby_llm/models.json';
const OUTPUT_FILE = path.join(__dirname, "..", 'src', 'llm', 'models.ts');

// Format the model ID for use in an enum (capitalize, replace hyphens and dots)
function formatModelId(id) {
  return id
    .toUpperCase()
    .replace(/-/g, '_')
    .replace(/\./g, '_');
}

// Fetch JSON data from URL
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch data: ${err.message}`));
    });
  });
}

// Check if a model supports text modality for both input and output
function supportsTextModality(model) {
  // Check if the model has modalities defined
  if (!model.modalities) return false;

  // Check if input modalities include text
  const hasTextInput = model.modalities.input && model.modalities.input.includes('text');

  // Check if output modalities include text
  const hasTextOutput = model.modalities.output && model.modalities.output.includes('text');

  return hasTextInput && hasTextOutput;
}

// Generate TypeScript models file
async function generateModelsFile() {
  try {
    console.log(`Fetching models from ${MODEL_JSON_URL}...`);
    const models = await fetchJson(MODEL_JSON_URL);

    // Filter for Gemini and OpenAI models that support text input and text output
    const filteredModels = models.filter(model =>
      (model.provider === 'gemini' || model.provider === 'openai') &&
      supportsTextModality(model)
    );

    if (filteredModels.length === 0) {
      console.error('No suitable Gemini or OpenAI models found in the JSON file');
      return;
    }

    console.log(`Found ${filteredModels.length} models (${filteredModels.filter(m => m.provider === 'gemini').length} Gemini, ${filteredModels.filter(m => m.provider === 'openai').length} OpenAI)`);

    // Group models by provider
    const geminiModels = filteredModels.filter(model => model.provider === 'gemini');
    const openaiModels = filteredModels.filter(model => model.provider === 'openai');

    // Generate TypeScript content
    let tsContent = `/**
 * Auto-generated model definitions
 * Generated on: ${new Date().toISOString()}
 * Source: ${MODEL_JSON_URL}
 */

/**
 * Model information including provider-specific details and token limits
 */
export interface ModelInfo {
  id: string;
  name: string;
  provider: 'gemini' | 'openai';
  maxOutputTokens: number | null;
  maxInputTokens: number | null;
}

/**
 * Available LLM models for use with the factory
 */
export enum LlmModel {
`;

    // Add all models to the enum
    for (const model of filteredModels) {
      const enumName = formatModelId(model.id);
      tsContent += `  /** ${model.name} */\n`;
      tsContent += `  ${enumName} = '${model.id}',\n\n`;
    }

    // Close the enum
    tsContent = tsContent.slice(0, -2) + '\n}\n\n';

    // Add the models mapping
    tsContent += `/**
 * Detailed information about each model
 */
export const MODELS: Record<LlmModel, ModelInfo> = {
`;

    // Add model details
    for (const model of filteredModels) {
      const enumName = formatModelId(model.id);

      // Default token values for models without specified limits
      const defaultOutputTokens = model.provider === 'gemini' ? 8192 : 4096;
      const defaultInputTokens = model.provider === 'gemini' ? 32768 : 16384;

      tsContent += `  [LlmModel.${enumName}]: {
    id: '${model.id}',
    name: '${model.name}',
    provider: '${model.provider}',
    maxOutputTokens: ${model.max_output_tokens === null ? defaultOutputTokens : model.max_output_tokens},
    maxInputTokens: ${model.context_window === null ? defaultInputTokens : model.context_window},
  },\n`;
    }

    // Close the mapping
    tsContent += `};\n`;

    // Add provider-specific model lookups
    tsContent += `
/**
 * Gemini-specific models
 */
export const GEMINI_MODELS = Object.values(MODELS).filter(model => model.provider === 'gemini');

/**
 * OpenAI-specific models
 */
export const OPENAI_MODELS = Object.values(MODELS).filter(model => model.provider === 'openai');
`;

    // Ensure the directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(OUTPUT_FILE, tsContent);
    console.log(`Generated ${OUTPUT_FILE} with ${filteredModels.length} models`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateModelsFile();