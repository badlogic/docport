/**
 * Auto-generated model definitions
 * Generated on: 2025-05-21T14:41:01.540Z
 * Source: https://raw.githubusercontent.com/crmne/ruby_llm/main/lib/ruby_llm/models.json
 */

/**
 * Model information including provider-specific details and token limits
 */
export interface ModelInfo {
  id: string;
  name: string;
  provider: 'gemini' | 'openai' | 'anthropic';
  maxOutputTokens: number | null;
  maxInputTokens: number | null;
}

/**
 * Available LLM models for use with the factory
 */
export enum LlmModel {
  /** Claude 2.0 */
  CLAUDE_2_0 = 'claude-2.0',

  /** Claude 2.1 */
  CLAUDE_2_1 = 'claude-2.1',

  /** Claude 3.5 Haiku */
  CLAUDE_3_5_HAIKU_20241022 = 'claude-3-5-haiku-20241022',

  /** Claude 3.5 Haiku */
  CLAUDE_3_5_HAIKU_LATEST = 'claude-3-5-haiku-latest',

  /** Claude 3.5 Sonnet (Old) */
  CLAUDE_3_5_SONNET_20240620 = 'claude-3-5-sonnet-20240620',

  /** Claude 3.5 Sonnet (New) */
  CLAUDE_3_5_SONNET_20241022 = 'claude-3-5-sonnet-20241022',

  /** Claude 3.7 Sonnet */
  CLAUDE_3_7_SONNET_20250219 = 'claude-3-7-sonnet-20250219',

  /** Claude 3.7 Sonnet */
  CLAUDE_3_7_SONNET_LATEST = 'claude-3-7-sonnet-latest',

  /** Claude 3 Haiku */
  CLAUDE_3_HAIKU_20240307 = 'claude-3-haiku-20240307',

  /** Claude 3 Opus */
  CLAUDE_3_OPUS_20240229 = 'claude-3-opus-20240229',

  /** Claude 3 Opus */
  CLAUDE_3_OPUS_LATEST = 'claude-3-opus-latest',

  /** Claude 3 Sonnet */
  CLAUDE_3_SONNET_20240229 = 'claude-3-sonnet-20240229',

  /** AQA */
  AQA = 'aqa',

  /** Embedding Gecko */
  EMBEDDING_GECKO_001 = 'embedding-gecko-001',

  /** Gemini 1.0 Pro Vision */
  GEMINI_1_0_PRO_VISION_LATEST = 'gemini-1.0-pro-vision-latest',

  /** Gemini 1.5 Flash */
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',

  /** Gemini 1.5 Flash */
  GEMINI_1_5_FLASH_001 = 'gemini-1.5-flash-001',

  /** Gemini 1.5 Flash 001 Tuning */
  GEMINI_1_5_FLASH_001_TUNING = 'gemini-1.5-flash-001-tuning',

  /** Gemini 1.5 Flash */
  GEMINI_1_5_FLASH_002 = 'gemini-1.5-flash-002',

  /** Gemini 1.5 Flash-8B */
  GEMINI_1_5_FLASH_8B = 'gemini-1.5-flash-8b',

  /** Gemini 1.5 Flash-8B */
  GEMINI_1_5_FLASH_8B_001 = 'gemini-1.5-flash-8b-001',

  /** Gemini 1.5 Flash 8B Experimental 0827 */
  GEMINI_1_5_FLASH_8B_EXP_0827 = 'gemini-1.5-flash-8b-exp-0827',

  /** Gemini 1.5 Flash 8B Experimental 0924 */
  GEMINI_1_5_FLASH_8B_EXP_0924 = 'gemini-1.5-flash-8b-exp-0924',

  /** Gemini 1.5 Flash-8B */
  GEMINI_1_5_FLASH_8B_LATEST = 'gemini-1.5-flash-8b-latest',

  /** Gemini 1.5 Flash */
  GEMINI_1_5_FLASH_LATEST = 'gemini-1.5-flash-latest',

  /** Gemini 1.5 Pro */
  GEMINI_1_5_PRO = 'gemini-1.5-pro',

  /** Gemini 1.5 Pro */
  GEMINI_1_5_PRO_001 = 'gemini-1.5-pro-001',

  /** Gemini 1.5 Pro */
  GEMINI_1_5_PRO_002 = 'gemini-1.5-pro-002',

  /** Gemini 1.5 Pro */
  GEMINI_1_5_PRO_LATEST = 'gemini-1.5-pro-latest',

  /** Gemini 2.0 Flash */
  GEMINI_2_0_FLASH = 'gemini-2.0-flash',

  /** Gemini 2.0 Flash */
  GEMINI_2_0_FLASH_001 = 'gemini-2.0-flash-001',

  /** Gemini 2.0 Flash */
  GEMINI_2_0_FLASH_EXP = 'gemini-2.0-flash-exp',

  /** Gemini 2.0 Flash-Lite */
  GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite',

  /** Gemini 2.0 Flash-Lite */
  GEMINI_2_0_FLASH_LITE_001 = 'gemini-2.0-flash-lite-001',

  /** Gemini 2.0 Flash-Lite Preview */
  GEMINI_2_0_FLASH_LITE_PREVIEW = 'gemini-2.0-flash-lite-preview',

  /** Gemini 2.0 Flash-Lite Preview 02-05 */
  GEMINI_2_0_FLASH_LITE_PREVIEW_02_05 = 'gemini-2.0-flash-lite-preview-02-05',

  /** Gemini 2.0 Flash Live */
  GEMINI_2_0_FLASH_LIVE_001 = 'gemini-2.0-flash-live-001',

  /** Gemini 2.0 Flash Preview Image Generation */
  GEMINI_2_0_FLASH_PREVIEW_IMAGE_GENERATION = 'gemini-2.0-flash-preview-image-generation',

  /** Gemini 2.5 Flash Preview 04-17 */
  GEMINI_2_0_FLASH_THINKING_EXP = 'gemini-2.0-flash-thinking-exp',

  /** Gemini 2.5 Flash Preview 04-17 */
  GEMINI_2_0_FLASH_THINKING_EXP_01_21 = 'gemini-2.0-flash-thinking-exp-01-21',

  /** Gemini 2.5 Flash Preview 04-17 */
  GEMINI_2_0_FLASH_THINKING_EXP_1219 = 'gemini-2.0-flash-thinking-exp-1219',

  /** Gemini 2.0 Pro Experimental */
  GEMINI_2_0_PRO_EXP = 'gemini-2.0-pro-exp',

  /** Gemini 2.0 Pro Experimental 02-05 */
  GEMINI_2_0_PRO_EXP_02_05 = 'gemini-2.0-pro-exp-02-05',

  /** Gemini 2.5 Flash Native Audio */
  GEMINI_2_5_FLASH_EXP_NATIVE_AUDIO_THINKING_DIALOG = 'gemini-2.5-flash-exp-native-audio-thinking-dialog',

  /** Gemini 2.5 Flash Preview 04-17 */
  GEMINI_2_5_FLASH_PREVIEW_04_17 = 'gemini-2.5-flash-preview-04-17',

  /** Gemini 2.5 Flash Preview 04-17 for cursor testing */
  GEMINI_2_5_FLASH_PREVIEW_04_17_THINKING = 'gemini-2.5-flash-preview-04-17-thinking',

  /** Gemini 2.5 Flash Preview 05-20 */
  GEMINI_2_5_FLASH_PREVIEW_05_20 = 'gemini-2.5-flash-preview-05-20',

  /** Gemini 2.5 Flash Native Audio */
  GEMINI_2_5_FLASH_PREVIEW_NATIVE_AUDIO_DIALOG = 'gemini-2.5-flash-preview-native-audio-dialog',

  /** Gemini 2.5 Pro Experimental 03-25 */
  GEMINI_2_5_PRO_EXP_03_25 = 'gemini-2.5-pro-exp-03-25',

  /** Gemini 2.5 Pro Preview 03-25 */
  GEMINI_2_5_PRO_PREVIEW_03_25 = 'gemini-2.5-pro-preview-03-25',

  /** Gemini 2.5 Pro Preview */
  GEMINI_2_5_PRO_PREVIEW_05_06 = 'gemini-2.5-pro-preview-05-06',

  /** Gemini Embedding Experimental */
  GEMINI_EMBEDDING_EXP = 'gemini-embedding-exp',

  /** Gemini Experimental 1206 */
  GEMINI_EXP_1206 = 'gemini-exp-1206',

  /** Gemini 1.0 Pro Vision */
  GEMINI_PRO_VISION = 'gemini-pro-vision',

  /** Gemma 3 12B */
  GEMMA_3_12B_IT = 'gemma-3-12b-it',

  /** Gemma 3 1B */
  GEMMA_3_1B_IT = 'gemma-3-1b-it',

  /** Gemma 3 27B */
  GEMMA_3_27B_IT = 'gemma-3-27b-it',

  /** Gemma 3 4B */
  GEMMA_3_4B_IT = 'gemma-3-4b-it',

  /** Gemma 3n E4B */
  GEMMA_3N_E4B_IT = 'gemma-3n-e4b-it',

  /** LearnLM 2.0 Flash Experimental */
  LEARNLM_2_0_FLASH_EXPERIMENTAL = 'learnlm-2.0-flash-experimental',

  /** babbage-002 */
  BABBAGE_002 = 'babbage-002',

  /** ChatGPT-4o */
  CHATGPT_4O_LATEST = 'chatgpt-4o-latest',

  /** codex-mini-latest */
  CODEX_MINI_LATEST = 'codex-mini-latest',

  /** computer-use-preview */
  COMPUTER_USE_PREVIEW = 'computer-use-preview',

  /** computer-use-preview */
  COMPUTER_USE_PREVIEW_2025_03_11 = 'computer-use-preview-2025-03-11',

  /** DALL·E 2 */
  DALL_E_2 = 'dall-e-2',

  /** davinci-002 */
  DAVINCI_002 = 'davinci-002',

  /** GPT-3.5 Turbo */
  GPT_3_5_TURBO = 'gpt-3.5-turbo',

  /** GPT-3.5 Turbo 0125 */
  GPT_3_5_TURBO_0125 = 'gpt-3.5-turbo-0125',

  /** GPT-3.5 Turbo 1106 */
  GPT_3_5_TURBO_1106 = 'gpt-3.5-turbo-1106',

  /** GPT-3.5 Turbo 16k */
  GPT_3_5_TURBO_16K = 'gpt-3.5-turbo-16k',

  /** GPT-3.5 Turbo Instruct */
  GPT_3_5_TURBO_INSTRUCT = 'gpt-3.5-turbo-instruct',

  /** GPT-3.5 Turbo Instruct 0914 */
  GPT_3_5_TURBO_INSTRUCT_0914 = 'gpt-3.5-turbo-instruct-0914',

  /** GPT-4 */
  GPT_4 = 'gpt-4',

  /** GPT-4 0125 Preview */
  GPT_4_0125_PREVIEW = 'gpt-4-0125-preview',

  /** GPT-4 */
  GPT_4_0613 = 'gpt-4-0613',

  /** GPT-4 1106 Preview */
  GPT_4_1106_PREVIEW = 'gpt-4-1106-preview',

  /** GPT-4 Turbo */
  GPT_4_TURBO = 'gpt-4-turbo',

  /** GPT-4 Turbo */
  GPT_4_TURBO_2024_04_09 = 'gpt-4-turbo-2024-04-09',

  /** GPT-4 Turbo Preview */
  GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview',

  /** GPT-4.1 */
  GPT_4_1 = 'gpt-4.1',

  /** GPT-4.1 */
  GPT_4_1_2025_04_14 = 'gpt-4.1-2025-04-14',

  /** GPT-4.1 mini */
  GPT_4_1_MINI = 'gpt-4.1-mini',

  /** GPT-4.1 mini */
  GPT_4_1_MINI_2025_04_14 = 'gpt-4.1-mini-2025-04-14',

  /** GPT-4.1 nano */
  GPT_4_1_NANO = 'gpt-4.1-nano',

  /** GPT-4.1 nano */
  GPT_4_1_NANO_2025_04_14 = 'gpt-4.1-nano-2025-04-14',

  /** GPT-4.5 Preview */
  GPT_4_5_PREVIEW = 'gpt-4.5-preview',

  /** GPT-4.5 Preview 20250227 */
  GPT_4_5_PREVIEW_2025_02_27 = 'gpt-4.5-preview-2025-02-27',

  /** GPT-4o */
  GPT_4O = 'gpt-4o',

  /** GPT-4o 20240513 */
  GPT_4O_2024_05_13 = 'gpt-4o-2024-05-13',

  /** GPT-4o */
  GPT_4O_2024_08_06 = 'gpt-4o-2024-08-06',

  /** GPT-4o 20241120 */
  GPT_4O_2024_11_20 = 'gpt-4o-2024-11-20',

  /** GPT-4o Audio */
  GPT_4O_AUDIO_PREVIEW = 'gpt-4o-audio-preview',

  /** GPT-4o Audio */
  GPT_4O_AUDIO_PREVIEW_2024_10_01 = 'gpt-4o-audio-preview-2024-10-01',

  /** GPT-4o-Audio Preview 20241217 */
  GPT_4O_AUDIO_PREVIEW_2024_12_17 = 'gpt-4o-audio-preview-2024-12-17',

  /** GPT-4o mini */
  GPT_4O_MINI = 'gpt-4o-mini',

  /** GPT-4o mini */
  GPT_4O_MINI_2024_07_18 = 'gpt-4o-mini-2024-07-18',

  /** GPT-4o mini Audio */
  GPT_4O_MINI_AUDIO_PREVIEW = 'gpt-4o-mini-audio-preview',

  /** GPT-4o mini Audio */
  GPT_4O_MINI_AUDIO_PREVIEW_2024_12_17 = 'gpt-4o-mini-audio-preview-2024-12-17',

  /** GPT-4o mini Realtime */
  GPT_4O_MINI_REALTIME_PREVIEW = 'gpt-4o-mini-realtime-preview',

  /** GPT-4o mini Realtime */
  GPT_4O_MINI_REALTIME_PREVIEW_2024_12_17 = 'gpt-4o-mini-realtime-preview-2024-12-17',

  /** GPT-4o mini Search Preview */
  GPT_4O_MINI_SEARCH_PREVIEW = 'gpt-4o-mini-search-preview',

  /** GPT-4o mini Search Preview */
  GPT_4O_MINI_SEARCH_PREVIEW_2025_03_11 = 'gpt-4o-mini-search-preview-2025-03-11',

  /** GPT-4o mini Transcribe */
  GPT_4O_MINI_TRANSCRIBE = 'gpt-4o-mini-transcribe',

  /** GPT-4o Realtime */
  GPT_4O_REALTIME_PREVIEW = 'gpt-4o-realtime-preview',

  /** GPT-4o Realtime */
  GPT_4O_REALTIME_PREVIEW_2024_10_01 = 'gpt-4o-realtime-preview-2024-10-01',

  /** GPT-4o-Realtime Preview 20241217 */
  GPT_4O_REALTIME_PREVIEW_2024_12_17 = 'gpt-4o-realtime-preview-2024-12-17',

  /** GPT-4o Search Preview */
  GPT_4O_SEARCH_PREVIEW = 'gpt-4o-search-preview',

  /** GPT-4o Search Preview */
  GPT_4O_SEARCH_PREVIEW_2025_03_11 = 'gpt-4o-search-preview-2025-03-11',

  /** GPT-4o Transcribe */
  GPT_4O_TRANSCRIBE = 'gpt-4o-transcribe',

  /** o1 */
  O1 = 'o1',

  /** o1 */
  O1_2024_12_17 = 'o1-2024-12-17',

  /** o1-mini */
  O1_MINI = 'o1-mini',

  /** o1-mini */
  O1_MINI_2024_09_12 = 'o1-mini-2024-09-12',

  /** O1-Preview */
  O1_PREVIEW = 'o1-preview',

  /** O1-Preview 20240912 */
  O1_PREVIEW_2024_09_12 = 'o1-preview-2024-09-12',

  /** o1-pro */
  O1_PRO = 'o1-pro',

  /** o1-pro */
  O1_PRO_2025_03_19 = 'o1-pro-2025-03-19',

  /** o3 */
  O3 = 'o3',

  /** o3 */
  O3_2025_04_16 = 'o3-2025-04-16',

  /** o3-mini */
  O3_MINI = 'o3-mini',

  /** o3-mini */
  O3_MINI_2025_01_31 = 'o3-mini-2025-01-31',

  /** o4-mini */
  O4_MINI = 'o4-mini',

  /** o4-mini */
  O4_MINI_2025_04_16 = 'o4-mini-2025-04-16',

  /** Omni Moderation 20240926 */
  OMNI_MODERATION_2024_09_26 = 'omni-moderation-2024-09-26',

  /** omni-moderation */
  OMNI_MODERATION_LATEST = 'omni-moderation-latest',

  /** text-embedding-3-large */
  TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large',

  /** text-embedding-3-small */
  TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small',

  /** text-embedding-ada-002 */
  TEXT_EMBEDDING_ADA_002 = 'text-embedding-ada-002',

  /** text-moderation */
  TEXT_MODERATION_LATEST = 'text-moderation-latest',

  /** TTS-1 1106 */
  TTS_1_1106 = 'tts-1-1106',

  /** TTS-1 HD 1106 */
  TTS_1_HD_1106 = 'tts-1-hd-1106',
}

/**
 * Detailed information about each model
 */
export const MODELS: Record<LlmModel, ModelInfo> = {
  [LlmModel.CLAUDE_2_0]: {
    id: 'claude-2.0',
    name: 'Claude 2.0',
    provider: 'anthropic',
    maxOutputTokens: 4096,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_2_1]: {
    id: 'claude-2.1',
    name: 'Claude 2.1',
    provider: 'anthropic',
    maxOutputTokens: 4096,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_5_HAIKU_20241022]: {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    maxOutputTokens: 8192,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_5_HAIKU_LATEST]: {
    id: 'claude-3-5-haiku-latest',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    maxOutputTokens: 8192,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_5_SONNET_20240620]: {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet (Old)',
    provider: 'anthropic',
    maxOutputTokens: 8192,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_5_SONNET_20241022]: {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet (New)',
    provider: 'anthropic',
    maxOutputTokens: 8192,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_7_SONNET_20250219]: {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    maxOutputTokens: 64000,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_7_SONNET_LATEST]: {
    id: 'claude-3-7-sonnet-latest',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    maxOutputTokens: 64000,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_HAIKU_20240307]: {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    maxOutputTokens: 4096,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_OPUS_20240229]: {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    maxOutputTokens: 4096,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_OPUS_LATEST]: {
    id: 'claude-3-opus-latest',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    maxOutputTokens: 4096,
    maxInputTokens: 200000,
  },
  [LlmModel.CLAUDE_3_SONNET_20240229]: {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    maxOutputTokens: 4096,
    maxInputTokens: 200000,
  },
  [LlmModel.AQA]: {
    id: 'aqa',
    name: 'AQA',
    provider: 'gemini',
    maxOutputTokens: 1024,
    maxInputTokens: 7168,
  },
  [LlmModel.EMBEDDING_GECKO_001]: {
    id: 'embedding-gecko-001',
    name: 'Embedding Gecko',
    provider: 'gemini',
    maxOutputTokens: 1,
    maxInputTokens: 1024,
  },
  [LlmModel.GEMINI_1_0_PRO_VISION_LATEST]: {
    id: 'gemini-1.0-pro-vision-latest',
    name: 'Gemini 1.0 Pro Vision',
    provider: 'gemini',
    maxOutputTokens: 4096,
    maxInputTokens: 12288,
  },
  [LlmModel.GEMINI_1_5_FLASH]: {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_1_5_FLASH_001]: {
    id: 'gemini-1.5-flash-001',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_1_5_FLASH_001_TUNING]: {
    id: 'gemini-1.5-flash-001-tuning',
    name: 'Gemini 1.5 Flash 001 Tuning',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 16384,
  },
  [LlmModel.GEMINI_1_5_FLASH_002]: {
    id: 'gemini-1.5-flash-002',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_1_5_FLASH_8B]: {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash-8B',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_1_5_FLASH_8B_001]: {
    id: 'gemini-1.5-flash-8b-001',
    name: 'Gemini 1.5 Flash-8B',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_1_5_FLASH_8B_EXP_0827]: {
    id: 'gemini-1.5-flash-8b-exp-0827',
    name: 'Gemini 1.5 Flash 8B Experimental 0827',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1000000,
  },
  [LlmModel.GEMINI_1_5_FLASH_8B_EXP_0924]: {
    id: 'gemini-1.5-flash-8b-exp-0924',
    name: 'Gemini 1.5 Flash 8B Experimental 0924',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1000000,
  },
  [LlmModel.GEMINI_1_5_FLASH_8B_LATEST]: {
    id: 'gemini-1.5-flash-8b-latest',
    name: 'Gemini 1.5 Flash-8B',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_1_5_FLASH_LATEST]: {
    id: 'gemini-1.5-flash-latest',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_1_5_PRO]: {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 2097152,
  },
  [LlmModel.GEMINI_1_5_PRO_001]: {
    id: 'gemini-1.5-pro-001',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 2097152,
  },
  [LlmModel.GEMINI_1_5_PRO_002]: {
    id: 'gemini-1.5-pro-002',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 2097152,
  },
  [LlmModel.GEMINI_1_5_PRO_LATEST]: {
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 2097152,
  },
  [LlmModel.GEMINI_2_0_FLASH]: {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_001]: {
    id: 'gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_EXP]: {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_LITE]: {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_LITE_001]: {
    id: 'gemini-2.0-flash-lite-001',
    name: 'Gemini 2.0 Flash-Lite',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_LITE_PREVIEW]: {
    id: 'gemini-2.0-flash-lite-preview',
    name: 'Gemini 2.0 Flash-Lite Preview',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_LITE_PREVIEW_02_05]: {
    id: 'gemini-2.0-flash-lite-preview-02-05',
    name: 'Gemini 2.0 Flash-Lite Preview 02-05',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_LIVE_001]: {
    id: 'gemini-2.0-flash-live-001',
    name: 'Gemini 2.0 Flash Live',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_PREVIEW_IMAGE_GENERATION]: {
    id: 'gemini-2.0-flash-preview-image-generation',
    name: 'Gemini 2.0 Flash Preview Image Generation',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 32000,
  },
  [LlmModel.GEMINI_2_0_FLASH_THINKING_EXP]: {
    id: 'gemini-2.0-flash-thinking-exp',
    name: 'Gemini 2.5 Flash Preview 04-17',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_THINKING_EXP_01_21]: {
    id: 'gemini-2.0-flash-thinking-exp-01-21',
    name: 'Gemini 2.5 Flash Preview 04-17',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_FLASH_THINKING_EXP_1219]: {
    id: 'gemini-2.0-flash-thinking-exp-1219',
    name: 'Gemini 2.5 Flash Preview 04-17',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_PRO_EXP]: {
    id: 'gemini-2.0-pro-exp',
    name: 'Gemini 2.0 Pro Experimental',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_0_PRO_EXP_02_05]: {
    id: 'gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro Experimental 02-05',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_5_FLASH_EXP_NATIVE_AUDIO_THINKING_DIALOG]: {
    id: 'gemini-2.5-flash-exp-native-audio-thinking-dialog',
    name: 'Gemini 2.5 Flash Native Audio',
    provider: 'gemini',
    maxOutputTokens: 8000,
    maxInputTokens: 128000,
  },
  [LlmModel.GEMINI_2_5_FLASH_PREVIEW_04_17]: {
    id: 'gemini-2.5-flash-preview-04-17',
    name: 'Gemini 2.5 Flash Preview 04-17',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_5_FLASH_PREVIEW_04_17_THINKING]: {
    id: 'gemini-2.5-flash-preview-04-17-thinking',
    name: 'Gemini 2.5 Flash Preview 04-17 for cursor testing',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_5_FLASH_PREVIEW_05_20]: {
    id: 'gemini-2.5-flash-preview-05-20',
    name: 'Gemini 2.5 Flash Preview 05-20',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_5_FLASH_PREVIEW_NATIVE_AUDIO_DIALOG]: {
    id: 'gemini-2.5-flash-preview-native-audio-dialog',
    name: 'Gemini 2.5 Flash Native Audio',
    provider: 'gemini',
    maxOutputTokens: 8000,
    maxInputTokens: 128000,
  },
  [LlmModel.GEMINI_2_5_PRO_EXP_03_25]: {
    id: 'gemini-2.5-pro-exp-03-25',
    name: 'Gemini 2.5 Pro Experimental 03-25',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_5_PRO_PREVIEW_03_25]: {
    id: 'gemini-2.5-pro-preview-03-25',
    name: 'Gemini 2.5 Pro Preview 03-25',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_2_5_PRO_PREVIEW_05_06]: {
    id: 'gemini-2.5-pro-preview-05-06',
    name: 'Gemini 2.5 Pro Preview',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_EMBEDDING_EXP]: {
    id: 'gemini-embedding-exp',
    name: 'Gemini Embedding Experimental',
    provider: 'gemini',
    maxOutputTokens: 1,
    maxInputTokens: 8192,
  },
  [LlmModel.GEMINI_EXP_1206]: {
    id: 'gemini-exp-1206',
    name: 'Gemini Experimental 1206',
    provider: 'gemini',
    maxOutputTokens: 65536,
    maxInputTokens: 1048576,
  },
  [LlmModel.GEMINI_PRO_VISION]: {
    id: 'gemini-pro-vision',
    name: 'Gemini 1.0 Pro Vision',
    provider: 'gemini',
    maxOutputTokens: 4096,
    maxInputTokens: 12288,
  },
  [LlmModel.GEMMA_3_12B_IT]: {
    id: 'gemma-3-12b-it',
    name: 'Gemma 3 12B',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 32768,
  },
  [LlmModel.GEMMA_3_1B_IT]: {
    id: 'gemma-3-1b-it',
    name: 'Gemma 3 1B',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 32768,
  },
  [LlmModel.GEMMA_3_27B_IT]: {
    id: 'gemma-3-27b-it',
    name: 'Gemma 3 27B',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 131072,
  },
  [LlmModel.GEMMA_3_4B_IT]: {
    id: 'gemma-3-4b-it',
    name: 'Gemma 3 4B',
    provider: 'gemini',
    maxOutputTokens: 8192,
    maxInputTokens: 32768,
  },
  [LlmModel.GEMMA_3N_E4B_IT]: {
    id: 'gemma-3n-e4b-it',
    name: 'Gemma 3n E4B',
    provider: 'gemini',
    maxOutputTokens: 2048,
    maxInputTokens: 8192,
  },
  [LlmModel.LEARNLM_2_0_FLASH_EXPERIMENTAL]: {
    id: 'learnlm-2.0-flash-experimental',
    name: 'LearnLM 2.0 Flash Experimental',
    provider: 'gemini',
    maxOutputTokens: 32768,
    maxInputTokens: 1048576,
  },
  [LlmModel.BABBAGE_002]: {
    id: 'babbage-002',
    name: 'babbage-002',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 16384,
  },
  [LlmModel.CHATGPT_4O_LATEST]: {
    id: 'chatgpt-4o-latest',
    name: 'ChatGPT-4o',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.CODEX_MINI_LATEST]: {
    id: 'codex-mini-latest',
    name: 'codex-mini-latest',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.COMPUTER_USE_PREVIEW]: {
    id: 'computer-use-preview',
    name: 'computer-use-preview',
    provider: 'openai',
    maxOutputTokens: 1024,
    maxInputTokens: 8192,
  },
  [LlmModel.COMPUTER_USE_PREVIEW_2025_03_11]: {
    id: 'computer-use-preview-2025-03-11',
    name: 'computer-use-preview',
    provider: 'openai',
    maxOutputTokens: 1024,
    maxInputTokens: 8192,
  },
  [LlmModel.DALL_E_2]: {
    id: 'dall-e-2',
    name: 'DALL·E 2',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
  [LlmModel.DAVINCI_002]: {
    id: 'davinci-002',
    name: 'davinci-002',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 16384,
  },
  [LlmModel.GPT_3_5_TURBO]: {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16385,
  },
  [LlmModel.GPT_3_5_TURBO_0125]: {
    id: 'gpt-3.5-turbo-0125',
    name: 'GPT-3.5 Turbo 0125',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16385,
  },
  [LlmModel.GPT_3_5_TURBO_1106]: {
    id: 'gpt-3.5-turbo-1106',
    name: 'GPT-3.5 Turbo 1106',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16385,
  },
  [LlmModel.GPT_3_5_TURBO_16K]: {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 Turbo 16k',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16385,
  },
  [LlmModel.GPT_3_5_TURBO_INSTRUCT]: {
    id: 'gpt-3.5-turbo-instruct',
    name: 'GPT-3.5 Turbo Instruct',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16385,
  },
  [LlmModel.GPT_3_5_TURBO_INSTRUCT_0914]: {
    id: 'gpt-3.5-turbo-instruct-0914',
    name: 'GPT-3.5 Turbo Instruct 0914',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16385,
  },
  [LlmModel.GPT_4]: {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    maxOutputTokens: 8192,
    maxInputTokens: 8192,
  },
  [LlmModel.GPT_4_0125_PREVIEW]: {
    id: 'gpt-4-0125-preview',
    name: 'GPT-4 0125 Preview',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 4096,
  },
  [LlmModel.GPT_4_0613]: {
    id: 'gpt-4-0613',
    name: 'GPT-4',
    provider: 'openai',
    maxOutputTokens: 8192,
    maxInputTokens: 8192,
  },
  [LlmModel.GPT_4_1106_PREVIEW]: {
    id: 'gpt-4-1106-preview',
    name: 'GPT-4 1106 Preview',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 4096,
  },
  [LlmModel.GPT_4_TURBO]: {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4_TURBO_2024_04_09]: {
    id: 'gpt-4-turbo-2024-04-09',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4_TURBO_PREVIEW]: {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo Preview',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4_1]: {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    provider: 'openai',
    maxOutputTokens: 32768,
    maxInputTokens: 1047576,
  },
  [LlmModel.GPT_4_1_2025_04_14]: {
    id: 'gpt-4.1-2025-04-14',
    name: 'GPT-4.1',
    provider: 'openai',
    maxOutputTokens: 32768,
    maxInputTokens: 1047576,
  },
  [LlmModel.GPT_4_1_MINI]: {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 mini',
    provider: 'openai',
    maxOutputTokens: 32768,
    maxInputTokens: 1047576,
  },
  [LlmModel.GPT_4_1_MINI_2025_04_14]: {
    id: 'gpt-4.1-mini-2025-04-14',
    name: 'GPT-4.1 mini',
    provider: 'openai',
    maxOutputTokens: 32768,
    maxInputTokens: 1047576,
  },
  [LlmModel.GPT_4_1_NANO]: {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 nano',
    provider: 'openai',
    maxOutputTokens: 32768,
    maxInputTokens: 1047576,
  },
  [LlmModel.GPT_4_1_NANO_2025_04_14]: {
    id: 'gpt-4.1-nano-2025-04-14',
    name: 'GPT-4.1 nano',
    provider: 'openai',
    maxOutputTokens: 32768,
    maxInputTokens: 1047576,
  },
  [LlmModel.GPT_4_5_PREVIEW]: {
    id: 'gpt-4.5-preview',
    name: 'GPT-4.5 Preview',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4_5_PREVIEW_2025_02_27]: {
    id: 'gpt-4.5-preview-2025-02-27',
    name: 'GPT-4.5 Preview 20250227',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O]: {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_2024_05_13]: {
    id: 'gpt-4o-2024-05-13',
    name: 'GPT-4o 20240513',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_2024_08_06]: {
    id: 'gpt-4o-2024-08-06',
    name: 'GPT-4o',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_2024_11_20]: {
    id: 'gpt-4o-2024-11-20',
    name: 'GPT-4o 20241120',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_AUDIO_PREVIEW]: {
    id: 'gpt-4o-audio-preview',
    name: 'GPT-4o Audio',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_AUDIO_PREVIEW_2024_10_01]: {
    id: 'gpt-4o-audio-preview-2024-10-01',
    name: 'GPT-4o Audio',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_AUDIO_PREVIEW_2024_12_17]: {
    id: 'gpt-4o-audio-preview-2024-12-17',
    name: 'GPT-4o-Audio Preview 20241217',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI]: {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_2024_07_18]: {
    id: 'gpt-4o-mini-2024-07-18',
    name: 'GPT-4o mini',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_AUDIO_PREVIEW]: {
    id: 'gpt-4o-mini-audio-preview',
    name: 'GPT-4o mini Audio',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_AUDIO_PREVIEW_2024_12_17]: {
    id: 'gpt-4o-mini-audio-preview-2024-12-17',
    name: 'GPT-4o mini Audio',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_REALTIME_PREVIEW]: {
    id: 'gpt-4o-mini-realtime-preview',
    name: 'GPT-4o mini Realtime',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_REALTIME_PREVIEW_2024_12_17]: {
    id: 'gpt-4o-mini-realtime-preview-2024-12-17',
    name: 'GPT-4o mini Realtime',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_SEARCH_PREVIEW]: {
    id: 'gpt-4o-mini-search-preview',
    name: 'GPT-4o mini Search Preview',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_SEARCH_PREVIEW_2025_03_11]: {
    id: 'gpt-4o-mini-search-preview-2025-03-11',
    name: 'GPT-4o mini Search Preview',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_MINI_TRANSCRIBE]: {
    id: 'gpt-4o-mini-transcribe',
    name: 'GPT-4o mini Transcribe',
    provider: 'openai',
    maxOutputTokens: 2000,
    maxInputTokens: 16000,
  },
  [LlmModel.GPT_4O_REALTIME_PREVIEW]: {
    id: 'gpt-4o-realtime-preview',
    name: 'GPT-4o Realtime',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_REALTIME_PREVIEW_2024_10_01]: {
    id: 'gpt-4o-realtime-preview-2024-10-01',
    name: 'GPT-4o Realtime',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_REALTIME_PREVIEW_2024_12_17]: {
    id: 'gpt-4o-realtime-preview-2024-12-17',
    name: 'GPT-4o-Realtime Preview 20241217',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_SEARCH_PREVIEW]: {
    id: 'gpt-4o-search-preview',
    name: 'GPT-4o Search Preview',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_SEARCH_PREVIEW_2025_03_11]: {
    id: 'gpt-4o-search-preview-2025-03-11',
    name: 'GPT-4o Search Preview',
    provider: 'openai',
    maxOutputTokens: 16384,
    maxInputTokens: 128000,
  },
  [LlmModel.GPT_4O_TRANSCRIBE]: {
    id: 'gpt-4o-transcribe',
    name: 'GPT-4o Transcribe',
    provider: 'openai',
    maxOutputTokens: 2000,
    maxInputTokens: 16000,
  },
  [LlmModel.O1]: {
    id: 'o1',
    name: 'o1',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O1_2024_12_17]: {
    id: 'o1-2024-12-17',
    name: 'o1',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O1_MINI]: {
    id: 'o1-mini',
    name: 'o1-mini',
    provider: 'openai',
    maxOutputTokens: 65536,
    maxInputTokens: 128000,
  },
  [LlmModel.O1_MINI_2024_09_12]: {
    id: 'o1-mini-2024-09-12',
    name: 'o1-mini',
    provider: 'openai',
    maxOutputTokens: 65536,
    maxInputTokens: 128000,
  },
  [LlmModel.O1_PREVIEW]: {
    id: 'o1-preview',
    name: 'O1-Preview',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O1_PREVIEW_2024_09_12]: {
    id: 'o1-preview-2024-09-12',
    name: 'O1-Preview 20240912',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O1_PRO]: {
    id: 'o1-pro',
    name: 'o1-pro',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O1_PRO_2025_03_19]: {
    id: 'o1-pro-2025-03-19',
    name: 'o1-pro',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O3]: {
    id: 'o3',
    name: 'o3',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O3_2025_04_16]: {
    id: 'o3-2025-04-16',
    name: 'o3',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O3_MINI]: {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O3_MINI_2025_01_31]: {
    id: 'o3-mini-2025-01-31',
    name: 'o3-mini',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O4_MINI]: {
    id: 'o4-mini',
    name: 'o4-mini',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.O4_MINI_2025_04_16]: {
    id: 'o4-mini-2025-04-16',
    name: 'o4-mini',
    provider: 'openai',
    maxOutputTokens: 100000,
    maxInputTokens: 200000,
  },
  [LlmModel.OMNI_MODERATION_2024_09_26]: {
    id: 'omni-moderation-2024-09-26',
    name: 'Omni Moderation 20240926',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
  [LlmModel.OMNI_MODERATION_LATEST]: {
    id: 'omni-moderation-latest',
    name: 'omni-moderation',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
  [LlmModel.TEXT_EMBEDDING_3_LARGE]: {
    id: 'text-embedding-3-large',
    name: 'text-embedding-3-large',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
  [LlmModel.TEXT_EMBEDDING_3_SMALL]: {
    id: 'text-embedding-3-small',
    name: 'text-embedding-3-small',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
  [LlmModel.TEXT_EMBEDDING_ADA_002]: {
    id: 'text-embedding-ada-002',
    name: 'text-embedding-ada-002',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
  [LlmModel.TEXT_MODERATION_LATEST]: {
    id: 'text-moderation-latest',
    name: 'text-moderation',
    provider: 'openai',
    maxOutputTokens: 32768,
    maxInputTokens: 16384,
  },
  [LlmModel.TTS_1_1106]: {
    id: 'tts-1-1106',
    name: 'TTS-1 1106',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
  [LlmModel.TTS_1_HD_1106]: {
    id: 'tts-1-hd-1106',
    name: 'TTS-1 HD 1106',
    provider: 'openai',
    maxOutputTokens: 4096,
    maxInputTokens: 16384,
  },
};

/**
 * Gemini-specific models
 */
export const GEMINI_MODELS = Object.values(MODELS).filter(model => model.provider === 'gemini');

/**
 * OpenAI-specific models
 */
export const OPENAI_MODELS = Object.values(MODELS).filter(model => model.provider === 'openai');

/**
 * Anthropic-specific models
 */
export const ANTHROPIC_MODELS = Object.values(MODELS).filter(model => model.provider === 'anthropic');
