import { LlmInterface, LlmOptions, LlmResponse } from './LlmInterface';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Configuration options for Anthropic LLM
 */
export interface AnthropicOptions extends LlmOptions {
    temperature: number;
    maxOutputTokens: number;
}

/**
 * Implementation of LLM interface for Anthropic models
 */
export class AnthropicLlm implements LlmInterface {
  private client: Anthropic;
  private modelName: string;
  private options: AnthropicOptions;

  /**
   * Create a new Anthropic LLM instance
   * @param options Configuration options
   */
  constructor(options: AnthropicOptions) {
    this.options = {
      ...options,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 4096,
    };

    this.modelName = options.model;

    this.client = new Anthropic({
      apiKey: options.apiKey
    });
  }

  /**
   * Send a prompt to Anthropic and get a completion
   * @param prompt The prompt text to send
   * @param json Whether to request JSON output
   * @returns The completion response
   */
  async complete(prompt: string, json = false): Promise<LlmResponse> {
    try {
      // Set system prompt for JSON if requested
      const systemPrompt = json
        ? "You are a helpful assistant that responds in JSON format only. No other text should be included."
        : "You are a helpful assistant.";

      // Use streaming internally to avoid timeout errors
      const streamResponse = await this.client.messages.stream({
        model: this.modelName,
        max_tokens: this.options.maxOutputTokens,
        temperature: this.options.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Collect the message content by streaming
      let responseText = '';
      let inputTokens = 0;
      let outputTokens = 0;

      // Process the stream
      for await (const chunk of streamResponse) {
        if (chunk.type === 'content_block_delta' && 
           'delta' in chunk && 
           'type' in chunk.delta && 
           chunk.delta.type === 'text_delta' && 
           'text' in chunk.delta) {
          responseText += chunk.delta.text;
        }
        
        if (chunk.type === 'message_delta' && 
           'usage' in chunk && 
           chunk.usage) {
          // Update token usage when available
          if (chunk.usage.input_tokens !== null) {
            inputTokens = chunk.usage.input_tokens;
          }
          if (chunk.usage.output_tokens !== null) {
            outputTokens = chunk.usage.output_tokens;
          }
        }
      }

      // Wait for the final message
      const finalMessage = await streamResponse.finalMessage();
      
      // Update token counts with final values
      if (finalMessage.usage?.input_tokens !== undefined && 
          finalMessage.usage.input_tokens !== null) {
        inputTokens = finalMessage.usage.input_tokens;
      }
      
      if (finalMessage.usage?.output_tokens !== undefined && 
          finalMessage.usage.output_tokens !== null) {
        outputTokens = finalMessage.usage.output_tokens;
      }
      
      return {
        text: responseText,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens
        }
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error(`Anthropic LLM error: ${(error as Error).message}`);
    }
  }

  /**
   * Get the name of the LLM provider
   */
  getName(): string {
    return 'Anthropic';
  }

  /**
   * Get the model being used
   */
  getModel(): string {
    return this.modelName;
  }
}