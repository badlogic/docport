# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Docport is a tool for transferring Javadoc documentation from Java source files to corresponding source files in other languages (C#, C++, TypeScript, JavaScript, Haxe, and ActionScript). It extracts Javadoc comments from Java files, identifies matching types in target language files, and uses LLMs (OpenAI or Google Gemini) to properly format the documentation for the target language.

## Development Commands

```bash
# Build the project
npm run build

# Run the compiled program
npm start

# Run during development (uses ts-node)
npm run dev

# Type checking only
npm run typecheck

# Update the list of available LLM models
npm run update-models

# Run a specific test
npm run test-single-pass
```

## Architecture

The codebase follows a modular architecture with these key components:

1. **CLI Interface** (`index.ts`, `javadocTransferCli.ts`)
   - Parses command-line arguments
   - Orchestrates the overall documentation transfer process

2. **Javadoc Extraction** (`javadocExtraction.ts`)
   - Uses tree-sitter to parse Java source files
   - Extracts Javadoc comments with their associated types

3. **Type Extraction** (`typeExtraction.ts`)
   - Identifies types in target language files
   - Maps types between Java and target languages

4. **Documentation Transfer** (`javadocTransfer.ts`)
   - Transfers and adapts documentation between languages
   - Applies Javadoc to the appropriate locations in target files

5. **LLM Integration** (`llm/` directory)
   - `LlmInterface.ts` - Common interface for LLM providers
   - `LlmFactory.ts` - Factory pattern for creating provider instances
   - `GeminiLlm.ts`/`OpenAILlm.ts` - Provider-specific implementations
   - `models.ts` - Lists of available models for each provider

## Environment Setup

The tool requires API keys for the LLM providers:
- `OPENAI_API_KEY` - For using OpenAI models
- `GEMINI_API_KEY` - For using Google Gemini models

These should be set as environment variables when developing or running the application.

## Testing Notes

Tests verify the Javadoc extraction logic and LLM integration. They require valid API keys for the LLM providers to be set as environment variables.

## Error Memories

- **Anthropic Non-Streaming Error**: When using the Anthropic Claude API, encountered a warning about long-running operations:
  ```
  Using model: Anthropic - claude-3-7-sonnet-20250219
  Anthropic API Error: AnthropicError: Streaming is strongly recommended for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-python#streaming-responses for more details
  ```
  - Appears during test runs with the Anthropic LLM implementation
  - Suggests using streaming mode for long-running API calls
  - Relevant file: `src/llm/AnthropicLlm.ts`
  - Test location: `src/tests/llmFactoryTest.ts`