# Docport

A tool to transfer Javadoc documentation from Java source files to other languages (C#, C++, TypeScript, JavaScript, Haxe, and ActionScript).

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
```

### Options

- `-j, --javadocs <path>` - Source directory containing Java files with Javadocs (required)
- `-r, --runtime <path>` - Source directory containing target runtime to transfer Javadocs to (required)
- `-m, --model <model>` - LLM model to use (default: gemini-2.5-flash-preview-0417-thinking)
- `-t, --temperature <temp>` - LLM temperature (default: 0.7)
- `-k, --key <key>` - LLM API key (optional, can use environment variables)
- `-h, --help` - Display help information

## Examples

```bash
# Transfer Javadocs from Java files to C# runtime
npm start -- -j ./java-src -r ./csharp-src

# Use a specific model
npm start -- -j ./java-src -r ./cpp-src -m gpt-4o

# Specify an API key directly
npm start -- -j ./java-src -r ./typescript-src -k your_api_key_here
```