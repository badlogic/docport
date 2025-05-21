import { findFiles, readFile } from './fileUtils';
import chalk from 'chalk';
import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

/**
 * Java element types
 */
export enum JavaElementType {
  CLASS = 'class',
  INTERFACE = 'interface',
  ENUM = 'enum'
}

/**
 * Java member (field or method)
 */
export interface JavaMember {
  /** Member signature (includes name, type, parameters) */
  signature: string;
  /** Verbatim Javadoc comment */
  javadoc: string;
}

/**
 * Enum constant
 */
export interface JavaEnumConstant {
  /** Constant name */
  name: string;
  /** Verbatim Javadoc comment */
  javadoc: string;
}

/**
 * Java type (class, interface, enum) with members
 */
export interface JavaType {
  /** Simple name without package */
  simpleName: string;
  /** Full name with package */
  fullName: string;
  /** Package name */
  packageName: string;
  /** Element type */
  type: JavaElementType;
  /** Verbatim Javadoc comment */
  javadoc: string;
  /** Members (fields and methods) */
  members: JavaMember[];
  /** Enum constants (for enums) */
  enumConstants?: JavaEnumConstant[];
  /** Nested types */
  nestedTypes: JavaType[];
  /** Source file path */
  sourcePath: string;
}

/**
 * Process a directory to extract Javadocs from all Java files using tree-sitter
 *
 * @param sourceDir Directory containing Java files
 * @returns Promise that resolves to the extraction result
 */
export async function extractJavadocs(sourceDir: string, typeCallback?: (type: JavaType) => void): Promise<JavaType[]> {
  console.log(chalk.blue(`🌲 Using tree-sitter for Java parsing`));

  const javaFiles = await findFiles(sourceDir, (e) => e.name.endsWith('.java'));
  const allTypes: JavaType[] = [];

  console.log(chalk.cyan.bold(`Found ${javaFiles.length} Java files to process`));

  for (const filePath of javaFiles) {
    const startTime = Date.now();
    console.log(chalk.yellow(`⏳ Processing ${chalk.bold(filePath)}...`));
    const javaCode = await readFile(filePath);
    const types = extractTypesFromJavaCode(javaCode, filePath);
    const durationSecs = (Date.now() - startTime) / 1000;

    if (types.length > 0) {
      console.log(chalk.green(`✅ Extracted ${chalk.bold(types.length)} types from ${chalk.bold(filePath)} in ${chalk.bold(durationSecs.toFixed(3) + 's')} using tree-sitter`));
    } else {
      console.log(chalk.red(`❌ No types found in ${chalk.bold(filePath)} (processed in ${chalk.bold(durationSecs.toFixed(3) + 's')} using tree-sitter)`));
    }

    if (typeCallback) {
      for (const type of types) {
        typeCallback(type);
      }
    }

    allTypes.push(...types);
  }

  return allTypes;
}

/**
 * Extract types from Java code using tree-sitter
 *
 * @param sourceCode Java source code
 * @param sourcePath Path to the source file
 * @returns List of found types
 */
export function extractTypesFromJavaCode(sourceCode: string, sourcePath: string): JavaType[] {
  // Initialize the parser with increased buffer size for large files
  const parser = new Parser();
  parser.setLanguage(Java);

  // Parse the source code with error handling
  let tree;
  try {
    // Create a buffer with a larger size first (defaults to 1024*1024 bytes)
    const BUFFER_SIZE = 10 * 1024 * 1024; // 10MB buffer

    // Parse with the larger buffer
    tree = parser.parse(sourceCode, undefined, {
      bufferSize: BUFFER_SIZE
    });
  } catch (error) {
    console.error(chalk.red(`Error parsing file: ${sourcePath}`));
    console.error(chalk.red(`Error details: ${error}`));
    // Return empty array on parsing error
    return [];
  }

  // Extract package name
  const packageName = extractPackageName(tree.rootNode);

  // Extract top-level types
  const types = extractTypes(tree.rootNode, packageName, sourcePath);

  return types;
}

/**
 * Extract package name from AST
 */
function extractPackageName(rootNode: Parser.SyntaxNode): string {
  const packageDecl = rootNode.children.find(node => node.type === 'package_declaration');
  if (!packageDecl) return '';

  // Get the text of the package declaration without the 'package' keyword and semicolon
  const packageIdentifier = packageDecl.text.replace(/^package\s+|;$/g, '').trim();
  return packageIdentifier;
}

/**
 * Extract types (classes, interfaces, enums) from an AST node
 */
function extractTypes(rootNode: Parser.SyntaxNode, packageName: string, sourcePath: string): JavaType[] {
  const types: JavaType[] = [];

  // Find all type declarations at the current level
  const typeNodes = rootNode.children.filter(node =>
    node.type === 'class_declaration' ||
    node.type === 'interface_declaration' ||
    node.type === 'enum_declaration'
  );

  for (const typeNode of typeNodes) {
    const type = extractType(typeNode, packageName, sourcePath);
    if (type) {
      types.push(type);
    }
  }

  return types;
}

/**
 * Extract a single type from a type declaration node
 */
function extractType(typeNode: Parser.SyntaxNode, packageName: string, sourcePath: string, parentFullName?: string): JavaType | null {
  // Get type name
  const nameNode = typeNode.descendantsOfType('identifier')[0];
  if (!nameNode) return null;

  const simpleName = nameNode.text;
  const fullName = parentFullName ? `${parentFullName}.${simpleName}` : packageName ? `${packageName}.${simpleName}` : simpleName;

  // Determine type
  let elementType: JavaElementType;
  switch (typeNode.type) {
    case 'class_declaration':
      elementType = JavaElementType.CLASS;
      break;
    case 'interface_declaration':
      elementType = JavaElementType.INTERFACE;
      break;
    case 'enum_declaration':
      elementType = JavaElementType.ENUM;
      break;
    default:
      return null;
  }

  // Extract javadoc comment
  const javadoc = extractJavadoc(typeNode);

  // Initialize the type
  const javaType: JavaType = {
    simpleName,
    fullName,
    packageName,
    type: elementType,
    javadoc,
    members: [],
    nestedTypes: [],
    sourcePath
  };

  // Handle body
  const bodyNode = findChildOfType(typeNode, ['class_body', 'interface_body', 'enum_body']);
  if (bodyNode) {
    // Extract members
    javaType.members = extractMembers(bodyNode);

    // Extract nested types
    javaType.nestedTypes = extractNestedTypes(bodyNode, packageName, sourcePath, fullName);

    // Extract enum constants if this is an enum
    if (elementType === JavaElementType.ENUM) {
      javaType.enumConstants = extractEnumConstants(bodyNode);
    }
  }

  return javaType;
}

/**
 * Extract all members (fields and methods) from a body node
 */
function extractMembers(bodyNode: Parser.SyntaxNode): JavaMember[] {
  const members: JavaMember[] = [];

  // Get all field and method declarations
  const memberNodes = bodyNode.children.filter(node =>
    node.type === 'field_declaration' ||
    node.type === 'method_declaration' ||
    node.type === 'constructor_declaration'
  );

  for (const memberNode of memberNodes) {
    const javadoc = extractJavadoc(memberNode);

    // Skip members without javadoc if specified
    if (javadoc === '') continue;

    // Get member signature
    let signature = '';

    if (memberNode.type === 'field_declaration') {
      // For fields, get type and name
      const typeNode = findChildOfType(memberNode, ['type_identifier', 'integral_type', 'floating_point_type', 'boolean_type', 'void_type']);
      const declarator = memberNode.descendantsOfType('variable_declarator')[0];
      const nameNode = declarator?.descendantsOfType('identifier')[0];

      if (typeNode && nameNode) {
        signature = `${typeNode.text} ${nameNode.text}`;
      } else {
        signature = memberNode.text.replace(/;$/, '').trim();
      }
    } else if (memberNode.type === 'method_declaration') {
      // For methods, get return type, name and parameters
      const returnTypeNode = findChildOfType(memberNode, ['type_identifier', 'integral_type', 'floating_point_type', 'boolean_type', 'void_type']);
      const nameNode = memberNode.descendantsOfType('identifier')[0];
      const paramsNode = memberNode.descendantsOfType('formal_parameters')[0];

      if (returnTypeNode && nameNode && paramsNode) {
        signature = `${returnTypeNode.text} ${nameNode.text}${paramsNode.text}`;
      } else {
        // Fallback to getting the method signature from text
        const blockNode = memberNode.descendantsOfType('block')[0];
        const endIndex = blockNode ? memberNode.text.indexOf(blockNode.text) : memberNode.text.length;
        signature = memberNode.text.substring(0, endIndex).replace(/\s*\{$/, '').trim();
      }
    } else if (memberNode.type === 'constructor_declaration') {
      // For constructors, get name and parameters
      const nameNode = memberNode.descendantsOfType('identifier')[0];
      const paramsNode = memberNode.descendantsOfType('formal_parameters')[0];

      if (nameNode && paramsNode) {
        signature = `${nameNode.text}${paramsNode.text}`;
      } else {
        // Fallback to getting the constructor signature from text
        const bodyNode = memberNode.descendantsOfType('constructor_body')[0];
        const endIndex = bodyNode ? memberNode.text.indexOf(bodyNode.text) : memberNode.text.length;
        signature = memberNode.text.substring(0, endIndex).replace(/\s*\{$/, '').trim();
      }
    }

    if (signature) {
      members.push({
        signature,
        javadoc
      });
    }
  }

  return members;
}

/**
 * Extract nested types from a body node
 */
function extractNestedTypes(bodyNode: Parser.SyntaxNode, packageName: string, sourcePath: string, parentFullName: string): JavaType[] {
  const nestedTypes: JavaType[] = [];

  // Find nested type declarations
  const nestedTypeNodes = bodyNode.children.filter(node =>
    node.type === 'class_declaration' ||
    node.type === 'interface_declaration' ||
    node.type === 'enum_declaration'
  );

  for (const nestedTypeNode of nestedTypeNodes) {
    const nestedType = extractType(nestedTypeNode, packageName, sourcePath, parentFullName);
    if (nestedType) {
      nestedTypes.push(nestedType);
    }
  }

  return nestedTypes;
}

/**
 * Extract enum constants from an enum body
 */
function extractEnumConstants(enumBodyNode: Parser.SyntaxNode): JavaEnumConstant[] {
  const constants: JavaEnumConstant[] = [];

  // Find enum constant nodes
  const constantNodes = enumBodyNode.children.filter(node => node.type === 'enum_constant');

  for (const constantNode of constantNodes) {
    const name = constantNode.text.replace(/,$/, '').trim();
    const javadoc = extractJavadoc(constantNode);

    // Skip constants without javadoc if specified
    if (javadoc === '') continue;

    constants.push({
      name,
      javadoc
    });
  }

  return constants;
}

/**
 * Extract javadoc comment for a node
 */
function extractJavadoc(node: Parser.SyntaxNode): string {
  // Check if the preceding sibling is a block comment
  const prevSibling = node.previousNamedSibling;
  if (prevSibling && prevSibling.type === 'block_comment') {
    const commentText = prevSibling.text;

    // Verify this is a javadoc comment (starts with /**)
    if (commentText.startsWith('/**')) {
      return commentText;
    }
  }

  return '';
}

/**
 * Find the first child node of a specific type
 */
function findChildOfType(node: Parser.SyntaxNode, types: string[]): Parser.SyntaxNode | null {
  for (const child of node.children) {
    if (types.includes(child.type)) {
      return child;
    }
  }
  return null;
}