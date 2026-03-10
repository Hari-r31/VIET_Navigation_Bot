import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { FEES, getLocations } from "../data/mockData";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Tool Definitions ---

const navigateTool: FunctionDeclaration = {
  name: "navigate",
  description: "Navigate the user to a specific location in the college campus. Use this when the user asks for directions or where something is.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      locationName: {
        type: Type.STRING,
        description: "The specific name of the location to navigate to (e.g., 'Library', 'CSE Department', 'Principal Office', 'Canteen')."
      }
    },
    required: ["locationName"]
  }
};

const showFeesTool: FunctionDeclaration = {
  name: "showFees",
  description: "Show the fee structure for a specific course and branch. Use this when the user asks about fees, costs, or tuition.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      course: {
        type: Type.STRING,
        description: "The course name. Must be one of: 'B.Tech', 'M.Tech', 'Diploma', 'MBA', 'BCA/BBA', 'MCA'."
      },
      branch: {
        type: Type.STRING,
        description: "The branch name. e.g., 'CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'VLSI', 'HR'."
      }
    },
    required: ["course", "branch"]
  }
};

const tools: Tool[] = [{
  functionDeclarations: [navigateTool, showFeesTool]
}];

// --- Data Preparation for System Instruction ---

const getLocationContext = () => {
  const locations = getLocations('en');
  return locations.map(loc => 
    `- ${loc.name} (${loc.id}): Located at ${loc.block}, ${loc.floor}. Aliases: ${loc.aliases.join(', ')}.`
  ).join('\n');
};

const getFeeContext = () => {
  return FEES.map(fee => 
    `- ${fee.course} ${fee.branch}: Seats: ${fee.seats}, Annual Fee: ₹${fee.annualFee}${fee.managementFee ? `, Management Fee: ₹${fee.managementFee}` : ''}${fee.spotFee ? `, Spot Fee: ₹${fee.spotFee}` : ''}.`
  ).join('\n');
};

const SYSTEM_INSTRUCTION = `You are a helpful and friendly AI assistant for the Visakha Institute of Engineering & Technology (VIET) campus kiosk. 

Your primary roles are:
1. Help users navigate to specific locations on campus.
2. Provide information about fee structures.

Campus Data:
Locations:
${getLocationContext()}

Fee Structures:
${getFeeContext()}

Guidelines:
- Be concise and polite.
- If the user's request is vague (e.g., "Where is the office?"), ask clarifying questions.
- If the user asks for fees but doesn't specify the course or branch, ask for those details.
- CRITICAL: When the user asks to navigate to a location (e.g., "navigate to canteen", "where is MBA block"), you MUST CALL the 'navigate' tool immediately. Do NOT just reply with text.
- CRITICAL: When the user asks about fees and provides the course and branch, you MUST CALL the 'showFees' tool immediately. Do NOT just reply with text.
- If the user greets you, greet them back warmly and ask how you can help.
- If the user asks about something unrelated to the campus, politely steer them back to campus-related topics.
`;

// --- Chat Session Management ---

let chatSession: any = null;
let currentLanguage: string = 'en';

export const startNewChat = (language: string = 'en') => {
  currentLanguage = language;
  
  const langInstruction = language === 'te' 
    ? "IMPORTANT: You MUST reply in Telugu (తెలుగు) language only." 
    : language === 'hi' 
      ? "IMPORTANT: You MUST reply in Hindi (हिंदी) language only." 
      : "IMPORTANT: You MUST reply in English language only.";

  const finalSystemInstruction = `${SYSTEM_INSTRUCTION}\n\n${langInstruction}`;

  chatSession = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: finalSystemInstruction,
      tools: tools,
      temperature: 0.7,
    }
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string, language: string = 'en') => {
  // If language changed or session doesn't exist, start new chat
  if (!chatSession || currentLanguage !== language) {
    startNewChat(language);
  }

  try {
    const response = await chatSession.sendMessage({ message });
    
    // Check for function calls
    const functionCalls = response.functionCalls;
    let toolCalls: any[] = [];
    
    if (functionCalls && functionCalls.length > 0) {
      toolCalls = functionCalls.map((call: any) => ({
        name: call.name,
        args: call.args
      }));
    }

    return {
      text: response.text || "",
      toolCalls: toolCalls
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: language === 'te' 
        ? "క్షమించండి, సర్వర్‌తో కనెక్ట్ అవ్వడంలో సమస్య ఉంది. దయచేసి మళ్ళీ ప్రయత్నించండి." 
        : language === 'hi' 
          ? "क्षमा करें, सर्वर से कनेक्ट करने में समस्या आ रही है। कृपया पुनः प्रयास करें।" 
          : "I'm sorry, I'm having trouble connecting to the server right now. Please try again.",
      toolCalls: []
    };
  }
};

export const sendToolResponseToGemini = async (toolName: string, result: any) => {
    if (!chatSession) return null;
    
    try {
        // Correctly format the function response for the SDK
        // The SDK expects the message to contain the function response part
        const response = await chatSession.sendMessage({
            message: [{
                functionResponse: {
                    name: toolName,
                    response: { result: result }
                }
            }]
        });
        
        return {
            text: response.text || "",
            toolCalls: response.functionCalls || []
        };
    } catch (e) {
        console.error("Error sending tool response:", e);
        return { text: "Error processing tool response.", toolCalls: [] };
    }
};
