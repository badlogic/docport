import { LlmInterface } from "./LlmInterface";
import { GeminiLlm } from "./GeminiLlm";
import { OpenAILlm } from "./OpenAILlm";
import { LlmModel, MODELS } from "./models";

/**
 * Factory for creating LLM instances
 */
export class LlmFactory {
  /**
   * Create a new LLM instance based on the model name
   * @param model The LLM model to use
   * @param apiKey API key for the selected model's provider
   * @param temperature Optional temperature setting (0-1)
   * @param jsonMode Optional JSON mode for OpenAI models
   * @returns An LLM instance
   */
  static create(
    model: LlmModel,
    apiKey?: string,
    temperature?: number
  ): LlmInterface {
    // Get model information
    const modelInfo = MODELS[model];
    if (!modelInfo) {
      throw new Error(`Unsupported LLM model: ${model}`);
    }

    // Use default max output tokens if not defined in the model info
    const maxOutputTokens =
      modelInfo.maxOutputTokens ||
      (modelInfo.provider === "gemini" ? 8192 : 4096);

    if (!apiKey) {
      if (modelInfo.provider === "gemini") {
        apiKey = process.env.GEMINI_API_KEY || "";
      } else if (modelInfo.provider === "openai") {
        apiKey = process.env.OPENAI_API_KEY || "";
      } else {
        throw new Error("No API key provided and no default key found");
      }
    }

    // Create the appropriate LLM instance based on provider
    switch (modelInfo.provider) {
      case "gemini":
        return new GeminiLlm({
          apiKey,
          model: modelInfo.id,
          temperature,
          maxOutputTokens,
        });

      case "openai":
        return new OpenAILlm({
          apiKey,
          model: modelInfo.id,
          temperature,
          maxOutputTokens
        });

      default:
        throw new Error(`Unsupported LLM provider: ${modelInfo.provider}`);
    }
  }
}
