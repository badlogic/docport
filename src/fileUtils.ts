import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively find all .java files in the given directory
 *
 * @param directory The directory to search in
 * @returns Array of file paths to .java files
 */
export async function findFiles(directory: string, filter: (entry: fs.Dirent<string>) => boolean = () => true): Promise<string[]> {
  const javaFiles: string[] = [];

  async function walkDir(dir: string): Promise<void> {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walkDir(fullPath)
      } else if (entry.isFile() && filter(entry))  {
        javaFiles.push(fullPath);
      }
    }
  }

  await walkDir(directory);
  return javaFiles;
}

export async function readFile(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, 'utf-8');
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  return fs.promises.writeFile(filePath, content, 'utf-8');
}