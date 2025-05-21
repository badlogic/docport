# Docport

A tool to transfer Javadoc documentation from Java source files to other languages (C#, C++, TypeScript, JavaScript, Haxe, and ActionScript).

Docport works by extracting Javadoc comments from Java source files, identifying matching types in target language files using tree-sitter parsers, and then using LLMs (OpenAI or Google Gemini) to transfer and format the documentation appropriately for the target language syntax.

The tool still requires a human to review the output and make any necessary adjustments.

Docport is used to keep the documentation in sync between the [Spine Runtimes Java reference implementation](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-libgdx/spine-libgdx) and ports to other languages, like [spine-cpp](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-cpp/spine-cpp).

## Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

```bash
# Transfer Javadocs
npm start -- -j <javadocs-directory> -r <runtime-directory> [options]

# During development
npm run dev -- -j <javadocs-directory> -r <runtime-directory> [options]
```

### Required Environment Variables

```bash
# For OpenAI models
export OPENAI_API_KEY=your_key_here

# For Google Gemini models
export GEMINI_API_KEY=your_key_here

# For Anthropic Claude models
export ANTHROPIC_API_KEY=your_key_here
```

### Options

- `-j, --javadocs <path>` - Source directory containing Java files with Javadocs (required)
- `-r, --runtime <path>` - Source directory containing target runtime to transfer Javadocs to (required)
- `-m, --model <model>` - LLM model to use (default: gemini-2.5-flash-preview-0417-thinking)
- `-t, --temperature <temp>` - LLM temperature (default: 0.7)
- `-k, --key <key>` - LLM API key (optional, can use environment variables)
- `-h, --help` - Display help information

For a list of model names that can be passed to the `--model` flag, see [LlmModel](./src/llm/models.ts).

## Examples

```bash
# Transfer Javadocs from Java files to C# runtime
npm start -- -j ./java-src -r ./csharp-src

# Use a specific model
npm start -- -j ./java-src -r ./cpp-src -m gpt-4o

# Specify an API key directly
npm start -- -j ./java-src -r ./typescript-src -k your_api_key_here
```