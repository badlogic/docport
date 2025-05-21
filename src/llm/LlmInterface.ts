/**
 * Interface for LLM services
 */
export interface LlmInterface {
  /**
   * Send a prompt to the LLM and get a completion
   * @param prompt The prompt to send
   * @returns The LLM's completion text
   */
  complete(prompt: string, json?: boolean): Promise<LlmResponse>;

  /**
   * Get the name of the LLM provider
   */
  getName(): string;

  /**
   * Get the model being used
   */
  getModel(): string;
}

/**
 * Usage information for an LLM completion
 */
export interface LlmUsage {
  /** Input token count */
  inputTokens: number;
  /** Output token count */
  outputTokens: number;
  /** Total token count */
  totalTokens: number;}

/**
 * Response from an LLM completion
 */
export interface LlmResponse {
  /** The completion text */
  text: string;
  /** The usage information */
  usage: LlmUsage;
}

/**
 * Options for LLM providers
 */
export interface LlmOptions {
  /** API key */
  apiKey: string;
  /** Model name */
  model: string;
  /** Temperature (0-1) */
  temperature?: number;
  /** Maximum tokens to generate */
  maxOutputTokens?: number;
}