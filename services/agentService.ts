
import { IntentType, AgentContext, AgentResponse, LocationData, LocationCategory } from '../types';
import { searchLocations } from './searchService';
import { FEES, LOCATIONS } from '../data/mockData';

// --- Constants & Patterns ---
const GREETINGS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'hola'];
const NAV_KEYWORDS = ['where', 'go', 'find', 'navigate', 'direction', 'route', 'way', 'location', 'map', 'take me'];
const FEE_KEYWORDS = ['fee', 'cost', 'price', 'tuition', 'money', 'pay', 'seat'];

// --- Helper: Intent Detection ---
const detectIntent = (text: string): IntentType => {
  const lower = text.toLowerCase();
  
  if (lower === 'clear' || lower === 'reset' || lower === 'restart') return IntentType.CLEAR;
  if (GREETINGS.some(g => lower.startsWith(g))) return IntentType.GREETING;
  if (FEE_KEYWORDS.some(k => lower.includes(k))) return IntentType.FEE;
  
  // Navigation is the fallback if keywords match OR if it looks like a location search
  if (NAV_KEYWORDS.some(k => lower.includes(k))) return IntentType.NAVIGATE;
  
  return IntentType.UNKNOWN;
};

// --- Helper: Entity Extraction ---
const extractFeeEntities = (text: string) => {
  const lower = text.toLowerCase();
  
  // Detect Course
  let course: string | undefined;
  if (lower.includes('b.tech') || lower.includes('btech')) course = 'B.Tech';
  else if (lower.includes('mba')) course = 'MBA';
  else if (lower.includes('diploma')) course = 'Diploma';

  // Detect Branch
  let branch: string | undefined;
  if (lower.includes('cse') || lower.includes('computer')) branch = 'CSE';
  else if (lower.includes('ece') || lower.includes('electronics')) branch = 'ECE';
  else if (lower.includes('eee') || lower.includes('electrical')) branch = 'EEE';
  else if (lower.includes('mech')) branch = 'MECH';
  else if (lower.includes('civil')) branch = 'CIVIL';

  return { course, branch };
};

// --- Core: Conversation Manager ---
export const processUserMessage = (
  text: string, 
  context: AgentContext
): AgentResponse => {
  const intent = detectIntent(text);
  const lowerText = text.toLowerCase();

  // 1. Handle Clarifications (Multi-turn)
  if (context.awaitingClarification) {
    
    // --- Fee Flow Clarifications ---
    if (context.clarificationType === 'FEE_COURSE') {
       const extracted = extractFeeEntities(text);
       if (extracted.course) {
         return handleFeeFlow({ ...context.partialFeeData, course: extracted.course }, { ...context, awaitingClarification: false });
       }
       return {
         message: "I didn't catch that. Please say B.Tech, MBA, or Diploma.",
         action: { type: 'NONE' },
         updatedContext: context
       };
    }
    
    if (context.clarificationType === 'FEE_BRANCH') {
       const extracted = extractFeeEntities(text);
       if (extracted.branch) {
         return handleFeeFlow({ ...context.partialFeeData, branch: extracted.branch }, { ...context, awaitingClarification: false });
       }
       return {
         message: "Could you specify the branch? (CSE, ECE, EEE, MECH)",
         action: { type: 'NONE' },
         updatedContext: context
       };
    }

    // --- Navigation Category Selection (e.g. User says "Departments") ---
    if (context.clarificationType === 'NAV_CATEGORY') {
        // Administrative Mapping
        if (lowerText.includes('admin') || lowerText.includes('office') || lowerText.includes('principal')) {
             return {
                 message: "Okay, Administrative Section. 🏛️\nAre you looking for the Principal's Chamber, Admin Office, Exam Cell, or NCC Room?",
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'NAV_SPECIFIC_SELECT',
                     categoryFilter: 'administrative'
                 }
             };
        } 
        // Academic Mapping
        else if (lowerText.includes('academic') || lowerText.includes('dept') || lowerText.includes('department') || lowerText.includes('class') || lowerText.includes('study')) {
             return {
                 message: "Got it, Academic Departments. 🎓\nWe have CSE, ECE, EEE, Mechanical, and Civil. Which one would you like to visit?",
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'NAV_SPECIFIC_SELECT',
                     categoryFilter: 'academic'
                 }
             };
        } 
        // Amenities Mapping
        else if (lowerText.includes('amenity') || lowerText.includes('common') || lowerText.includes('mess') || lowerText.includes('library') || lowerText.includes('food') || lowerText.includes('restroom')) {
             return {
                 message: "General Amenities. ☕\nI can take you to the Central Library, Canteen, Seminar Hall, or Girls Waiting Room. What's your choice?",
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'NAV_SPECIFIC_SELECT',
                     categoryFilter: 'amenity'
                 }
             };
        }
        
        // Fallback: If they skipped category and named a specific place (e.g. "Library")
        const matches = searchLocations(text);
        if (matches.length > 0) {
            return {
                message: `Ah, found it directly! Taking you to ${matches[0].name}.`,
                action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                updatedContext: {} 
            };
        }

        return {
            message: "I didn't quite understand. Please choose: 'Administrative', 'Departments', or 'Amenities'.",
            action: { type: 'NONE' },
            updatedContext: context
        };
    }

    // --- Navigation Specific Selection (e.g. User says "CSE") ---
    if (context.clarificationType === 'NAV_SPECIFIC_SELECT') {
        // Search globally first
        let matches = searchLocations(text);

        // If we have a category filter, prioritize matches in that category
        if (context.categoryFilter) {
            const categoryMatches = matches.filter(m => m.category === context.categoryFilter);
            if (categoryMatches.length > 0) {
                matches = categoryMatches; // Use filtered list
            }
        }

        if (matches.length > 0) {
            return {
                message: `Excellent choice. Navigating to ${matches[0].name}.`,
                action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                updatedContext: {} // Reset context
            };
        } else {
             // Handle Department nicknames manually if search fails (e.g. "Computer science" vs "CSE")
             if (context.categoryFilter === 'academic') {
                if (lowerText.includes('computer') || lowerText.includes('cs')) matches = searchLocations('CSE');
                else if (lowerText.includes('electronic') || lowerText.includes('ec')) matches = searchLocations('ECE');
                else if (lowerText.includes('electric') || lowerText.includes('ee')) matches = searchLocations('EEE');
                else if (lowerText.includes('civil')) matches = searchLocations('Civil'); // Capitalize for search
                else if (lowerText.includes('mech')) matches = searchLocations('MECH');
                
                if (matches.length > 0) {
                    return {
                        message: `Navigating to ${matches[0].name}.`,
                        action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                        updatedContext: {} 
                    };
                }
             }

             return {
                 message: `I couldn't find "${text}" in this section. Try saying the exact name (e.g., 'CSE' or 'Library') or say 'Restart'.`,
                 action: { type: 'NONE' },
                 updatedContext: context
             };
        }
    }

    if (context.clarificationType === 'LOCATION_CONFIRM') {
        if (lowerText.includes('yes') || lowerText.includes('yeah') || lowerText.includes('ok') || lowerText.includes('sure')) {
             return {
                message: `Great! Navigating to ${context.potentialLocation?.name}...`,
                action: { type: 'NAVIGATE', payload: { initialQuery: context.potentialLocation?.name } },
                updatedContext: {} // Reset
             };
        } else {
            return {
                message: "Okay, cancelled. What else can I help you find?",
                action: { type: 'NONE' },
                updatedContext: {}
            };
        }
    }

    if (context.clarificationType === 'LOCATION_DISAMBIGUATE') {
        const matches = searchLocations(text);
        if (matches.length > 0) {
             return {
                message: `Got it. Taking you to ${matches[0].name}.`,
                action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                updatedContext: {} 
             };
        } else {
             return {
                 message: "I'm still having trouble. Try searching for the exact Department or Block name.",
                 action: { type: 'NONE' },
                 updatedContext: {}
             };
        }
    }
  }

  // 2. Handle New Intents
  switch (intent) {
    case IntentType.GREETING:
      return {
        message: "Hello! 👋 I can help you find locations or check fee structures. Try asking 'Where is the library?' or 'Show B.Tech fees'.",
        action: { type: 'NONE' },
        updatedContext: context
      };

    case IntentType.CLEAR:
      return {
        message: "Okay, let's start over. How can I help?",
        action: { type: 'NONE' },
        updatedContext: {}
      };

    case IntentType.FEE:
      const entities = extractFeeEntities(text);
      return handleFeeFlow(entities, context);

    case IntentType.NAVIGATE:
    case IntentType.UNKNOWN: // Treat unknown as potential navigation search
      // Remove keywords to isolate the location name
      const cleanQuery = text.replace(/i need|want to|help|navigation|where is|go to|find|navigate to|show me|the|directions to|location|take me to/gi, '').trim();
      
      // If query is too short or empty, it means user asked "Directions" or "Navigation help" without specific location
      if (cleanQuery.length < 3) {
          return {
              message: "Sure! Are you looking for Administrative offices 🏛️, Academic departments 🎓, or General amenities ☕?",
              action: { type: 'NONE' },
              updatedContext: {
                  ...context,
                  awaitingClarification: true,
                  clarificationType: 'NAV_CATEGORY'
              }
          };
      }

      const matches = searchLocations(cleanQuery);
      
      if (matches.length > 0) {
        // AMBIGUITY CHECK:
        if (matches.length > 1 && cleanQuery.length < 5) {
             const options = matches.slice(0, 3).map(m => m.name).join(", or ");
             return {
                 message: `I found a few places. Did you mean ${options}?`,
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'LOCATION_DISAMBIGUATE'
                 }
             };
        }

        const topMatch = matches[0];
        
        return {
           message: `Found it! Taking you to ${topMatch.name}.`,
           action: { type: 'NAVIGATE', payload: { initialQuery: topMatch.name } },
           updatedContext: {}
        };
      } else {
        return {
          message: "I couldn't find that location. 😕 Try searching for a department (e.g., 'CSE'), 'Library', or 'Canteen'.",
          action: { type: 'NONE' },
          updatedContext: context
        };
      }
  }

  return {
    message: "I'm not sure I understand. Try asking for 'Fees' or 'Directions'.",
    action: { type: 'NONE' },
    updatedContext: context
  };
};

// --- Sub-Flow: Fees ---
function handleFeeFlow(data: { course?: string; branch?: string }, currentContext: AgentContext): AgentResponse {
   // 1. Missing Course
   if (!data.course) {
     return {
       message: "Which course are you interested in? (B.Tech, MBA, Diploma)",
       action: { type: 'NONE' },
       updatedContext: {
         ...currentContext,
         awaitingClarification: true,
         clarificationType: 'FEE_COURSE',
         partialFeeData: data
       }
     };
   }

   // 2. Missing Branch
   if (!data.branch) {
     return {
       message: `For ${data.course}, which branch? (e.g., CSE, ECE)`,
       action: { type: 'NONE' },
       updatedContext: {
         ...currentContext,
         awaitingClarification: true,
         clarificationType: 'FEE_BRANCH',
         partialFeeData: data
       }
     };
   }

   // 3. All Good
   return {
     message: `Opening fee structure for ${data.course} - ${data.branch}...`,
     action: { 
         type: 'SHOW_FEES',
         payload: { initialCourse: data.course, initialBranch: data.branch }
     },
     updatedContext: {}
   };
}
