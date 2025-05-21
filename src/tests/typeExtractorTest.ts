import { extractTypesFromSourceCode } from '../typeExtraction';

// Test C++ code with SP_API macros
const cppWithMacros = `
namespace spine {
    class SP_API Animation : public SpineObject {
        friend class AnimationState;
    public:
        Animation(const String &name, Vector<Timeline *> &timelines, float duration);
    };

    class SP_API AnimationState : public SpineObject, public HasRendererObject {
        friend class TrackEntry;
    public:
        AnimationState();
    };

    class SP_API TrackEntry {
    public:
        TrackEntry();
    };

    enum EventType {
        EventType_Start = 0,
        EventType_Interrupt,
        EventType_End
    };

    struct EventQueue {
        EventQueueEntry* head;
    };

    typedef struct {
        EventQueue* queue;
    } EventQueueEntry;
}
`;

async function testExtraction() {
  console.log("Testing C++ type extraction with macro preprocessing...");

  const { types } = extractTypesFromSourceCode(cppWithMacros, "/virtual/Animation.h");
  console.log(`Found ${types.length} types`);

  // Sort by name
  types.sort((a, b) => a.localeCompare(b));

  // Print found types
  types.forEach(type => {
    console.log(`- ${type}`);
  });

  // Check for expected types
  const expectedTypes = ['Animation', 'AnimationState', 'TrackEntry', 'EventType', 'EventQueue', 'EventQueueEntry'];
  console.log("\nChecking for expected types:");
  for (const expectedType of expectedTypes) {
    const found = types.some(t => t === expectedType);
    console.log(`- ${expectedType}: ${found ? '✅' : '❌'}`);
  }
}

testExtraction();