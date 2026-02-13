
import { IntentType, AgentContext, AgentResponse, LocationData } from '../types';
import { searchLocations } from './searchService';
import { FEES } from '../data/mockData';

// --- Constants & Patterns ---
const GREETINGS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'hola'];
const NAV_KEYWORDS = ['where', 'go', 'find', 'navigate', 'direction', 'route', 'way', 'location', 'map'];
const FEE_KEYWORDS = ['fee', 'cost', 'price', 'tuition', 'money', 'pay', 'seat'];

// --- Helper: Intent Detection ---
const detectIntent = (text: string): IntentType => {
  const lower = text.toLowerCase();
  
  if (lower === 'clear' || lower === 'reset') return IntentType.CLEAR;
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
       // Allow skipping branch if they just want general info? For now enforce valid branch or generic.
       return {
         message: "Could you specify the branch? (CSE, ECE, EEE, MECH)",
         action: { type: 'NONE' },
         updatedContext: context
       };
    }

    if (context.clarificationType === 'LOCATION_CONFIRM') {
        if (lowerText.includes('yes') || lowerText.includes('yeah') || lowerText.includes('ok')) {
             return {
                message: `Navigating to ${context.potentialLocation?.name}...`,
                action: { type: 'NAVIGATE', payload: { initialQuery: context.potentialLocation?.name } },
                updatedContext: {} // Reset
             };
        } else {
            return {
                message: "Okay, let's try again. Where would you like to go?",
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
        message: "Hello! I can help you find locations or check fee structures. What do you need?",
        action: { type: 'NONE' },
        updatedContext: context
      };

    case IntentType.CLEAR:
      return {
        message: "Conversation reset. How can I help?",
        action: { type: 'NONE' },
        updatedContext: {}
      };

    case IntentType.FEE:
      const entities = extractFeeEntities(text);
      return handleFeeFlow(entities, context);

    case IntentType.NAVIGATE:
    case IntentType.UNKNOWN: // Treat unknown as potential navigation search
      // Remove keywords to isolate the location name
      const cleanQuery = text.replace(/where is|go to|find|navigate to|show me|the/gi, '').trim();
      
      if (cleanQuery.length < 2) {
          return {
              message: "I'm listening. Where do you want to go, or what fees are you looking for?",
              action: { type: 'NONE' },
              updatedContext: context
          };
      }

      const matches = searchLocations(cleanQuery);
      
      if (matches.length > 0) {
        // High confidence match (Fuse.js usually sorts by score)
        const topMatch = matches[0];
        
        // If query is very short or ambiguous, maybe confirm? 
        // For kiosk, speed is key. If distinct match, just go.
        return {
           message: `Found it! Taking you to ${topMatch.name}.`,
           action: { type: 'NAVIGATE', payload: { initialQuery: topMatch.name } },
           updatedContext: {}
        };
      } else {
        return {
          message: "I couldn't find that location. Try searching for a department (e.g., 'CSE') or amenity (e.g., 'Canteen').",
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

   // 2. Missing Branch (Only for B.Tech/Diploma usually, MBA has 'General')
   // Simple check: if we have course but no branch, ask for branch
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
     action: { type: 'SHOW_FEES' }, // The view will handle state if we pass it, but for now just routing
     updatedContext: {}
   };
}
