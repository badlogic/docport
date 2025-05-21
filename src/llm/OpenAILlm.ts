import { LlmInterface, LlmOptions, LlmResponse } from './LlmInterface';
import OpenAI from 'openai';

/**
 * Configuration options for OpenAI LLM
 */
export interface OpenAIOptions extends LlmOptions {
}

/**
 * Implementation of LLM interface for OpenAI models
 */
export class OpenAILlm implements LlmInterface {
  private client: OpenAI;
  private modelName: string;
  private options: OpenAIOptions;

  /**
   * Create a new OpenAI LLM instance
   * @param options Configuration options
   */
  constructor(options: OpenAIOptions) {
    this.options = {
      ...options,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 100000,
    };

    this.modelName = options.model;

    this.client = new OpenAI({
      apiKey: options.apiKey
    });
  }

  /**
   * Send a prompt to OpenAI and get a completion
   * @param prompt The prompt text to send
   * @returns The completion response
   */
  async complete(prompt: string, json = false): Promise<LlmResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.options.temperature,
        max_completion_tokens: this.options.maxOutputTokens,
        response_format: json ? { type: 'json_object' } : { type: 'text' }
      });

      const completionText = response.choices[0]?.message?.content || '';

      // Get token usage information
      const inputTokens = response.usage?.prompt_tokens || 0;
      const outputTokens = response.usage?.completion_tokens || 0;
      const totalTokens = response.usage?.total_tokens || 0;

      return {
        text: completionText,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens
        }
      };
    } catch (error) {
      throw new Error(`OpenAI LLM error: ${(error as Error).message}`);
    }
  }

  /**
   * Get the name of the LLM provider
   */
  getName(): string {
    return 'OpenAI';
  }

  /**
   * Get the model being used
   */
  getModel(): string {
    return this.modelName;
  }
}