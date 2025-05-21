import { extractTypesFromJavaCode, JavaElementType, JavaMember, JavaType, JavaEnumConstant } from '../javadocExtraction';
import { LlmModel } from '../llm/models';
import { LlmFactory } from '../llm/LlmFactory';
const sampleJavaClass = `
package com.example;

/**
 * This is a sample class for testing Javadoc extraction.
 * It contains various elements with documentation.
 *
 * @author Test User
 * @version 1.0
 */
public class SampleClass {

    /**
     * A documented field
     */
    private String documentedField;

    private int undocumentedField;

    /**
     * Constructor for SampleClass
     *
     * @param param1 First parameter
     * @param param2 Second parameter
     */
    public SampleClass(String param1, int param2) {
        // Constructor code
    }

    /**
     * A documented method that returns a value
     *
     * @param input The input string
     * @return The processed result
     * @throws IllegalArgumentException If input is invalid
     */
    public String documentedMethod(String input) {
        if (input == null) {
            throw new IllegalArgumentException("Input cannot be null");
        }
        return "Processed: " + input;
    }

    public void undocumentedMethod() {
        // No documentation
    }

    /**
     * A nested enum with documented constants
     */
    public enum SampleEnum {
        /**
         * First enum value
         */
        ONE,

        /**
         * Second enum value
         */
        TWO,

        THREE
    }

    /**
     * A nested interface
     */
    public interface NestedInterface {
        /**
         * Interface method
         *
         * @param value Value to process
         */
        void process(int value);
    }
}
`;

/**
 * Test the Java parser with the sample Java code
 */
async function testParseJavaSource() {
  console.log("Testing Java parser...");

  const llm = LlmFactory.create(LlmModel.GPT_4O_MINI);
  console.log(`Using LLM: ${llm.getName()} - ${llm.getModel()}`);

  try {
    const types = await extractTypesFromJavaCode(sampleJavaClass, "SampleClass.java");

    if (types.length !== 1) {
      console.error(`Expected 1 type, got ${types.length}`);
      return false;
    }

    const sampleClass = types[0];
    console.log("Class found:", sampleClass.simpleName);
    console.log("Package:", sampleClass.packageName);

    console.log("\nClass javadoc:");
    console.log(sampleClass.javadoc);

    console.log(`\nMembers (${sampleClass.members.length}):`);
    sampleClass.members.forEach((member: JavaMember) => {
      console.log(`- ${member.signature}`);
      console.log(`  Javadoc: ${member.javadoc}`);
    });

    if (sampleClass.nestedTypes && sampleClass.nestedTypes.length > 0) {
      console.log(`\nNested types (${sampleClass.nestedTypes.length}):`);
      sampleClass.nestedTypes.forEach((nestedType: JavaType) => {
        console.log(`- ${nestedType.simpleName} (${nestedType.type})`);
        console.log(`  Javadoc: ${nestedType.javadoc}`);

        if (nestedType.type === JavaElementType.ENUM && nestedType.enumConstants) {
          console.log(`  Enum constants (${nestedType.enumConstants.length}):`);
          nestedType.enumConstants.forEach((constant: JavaEnumConstant) => {
            console.log(`    - ${constant.name}`);
            console.log(`      Javadoc: ${constant.javadoc || 'None'}`);
          });
        }

        if (nestedType.members.length > 0) {
          console.log(`  Members (${nestedType.members.length}):`);
          nestedType.members.forEach((member: JavaMember) => {
            console.log(`    - ${member.signature}`);
            console.log(`      Javadoc: ${member.javadoc}`);
          });
        }
      });
    } else {
      console.log("\nNo nested types found.");
    }

    return true;
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1);
  }
}

/**
 * Run the tests
 */
async function runTests() {
  console.log("Starting Java parser tests...\n");

  try {
    const testResult = await testParseJavaSource();

    if (testResult) {
      console.log("\nTests passed successfully!");
    } else {
      console.error("\nTests failed!");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

export { runTests };