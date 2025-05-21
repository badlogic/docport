import { GoogleGenerativeAI } from '@google/generative-ai';
import { LlmInterface, LlmOptions, LlmResponse } from './LlmInterface';

/**
 * Configuration options for Gemini LLM
 */
export interface GeminiOptions extends LlmOptions {
}

/**
 * Implementation of LLM interface for Google's Gemini models
 */
export class GeminiLlm implements LlmInterface {
  private genAI: GoogleGenerativeAI;
  private modelName: string;
  private options: GeminiOptions;

  /**
   * Create a new Gemini LLM instance
   * @param options Configuration options
   */
  constructor(options: GeminiOptions) {
    this.options = {
      ...options,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 64000
    };

    this.modelName = options.model;

    this.genAI = new GoogleGenerativeAI(options.apiKey);
  }

  /**
   * Send a prompt to Gemini and get a completion
   * @param prompt The prompt text to send
   * @returns The completion response
   */
  async complete(prompt: string, json = false): Promise<LlmResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.options.model,
        generationConfig: {
          temperature: this.options.temperature,
          maxOutputTokens: this.options.maxOutputTokens,
          responseMimeType: json ? 'application/json' : 'text/plain',
        },
      });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      let inputTokens = 0;
      let outputTokens = 0;
      let totalTokens = 0;

      if (response.usageMetadata) {
        inputTokens = response.usageMetadata.promptTokenCount ?? 0;
        outputTokens = response.usageMetadata.candidatesTokenCount ?? 0;
        totalTokens = response.usageMetadata.totalTokenCount ?? 0;
      } else {
        inputTokens = Math.ceil(prompt.length / 4);
        outputTokens = Math.ceil(text.length / 4);
        totalTokens = inputTokens + outputTokens;
      }

      return {
        text,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens
        }
      };
    } catch (error) {
      throw new Error(`Gemini LLM error: ${(error as Error).message}`);
    }
  }

  getName(): string {
    return 'Google Gemini';
  }

  getModel(): string {
    return this.modelName;
  }
}