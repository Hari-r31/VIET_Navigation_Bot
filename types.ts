
export interface NavStep {
  instruction: string;
  detail?: string;
  icon?: 'turn-left' | 'turn-right' | 'straight' | 'stairs-up' | 'stairs-down' | 'destination';
}

export type LocationCategory = 'administrative' | 'academic' | 'amenity' | 'other';

export interface LocationData {
  id: string;
  name: string;
  block: string;
  floor: string;
  category: LocationCategory;
  department?: string; // e.g., 'ECE', 'CSE', 'Civil'
  aliases: string[];
  distance: number; // meters
  estimatedTime: number; // minutes
  steps: NavStep[];
  mapImage?: string;
}

export interface FeeStructure {
  id: string;
  course: string;
  branch: string;
  seats: number;
  annualFee: number;
  description?: string;
}

// --- Agent Types ---

export enum IntentType {
  NAVIGATE = 'NAVIGATE',
  FEE = 'FEE',
  GREETING = 'GREETING',
  UNKNOWN = 'UNKNOWN',
  CLEAR = 'CLEAR'
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isTyping?: boolean;
  timestamp: number;
}

export interface AgentContext {
  awaitingClarification?: boolean;
  clarificationType?: 'FEE_COURSE' | 'FEE_BRANCH' | 'LOCATION_CONFIRM' | 'LOCATION_DISAMBIGUATE' | 'NAV_CATEGORY' | 'NAV_SPECIFIC_SELECT';
  categoryFilter?: LocationCategory; // New: Remembers if user said "Academic" vs "Admin"
  partialFeeData?: {
    course?: string;
    branch?: string;
  };
  potentialLocation?: LocationData;
}

export interface AgentAction {
  type: 'NAVIGATE' | 'SHOW_FEES' | 'NONE';
  payload?: any;
}

export interface AgentResponse {
  message: string;
  action: AgentAction;
  updatedContext: AgentContext;
}
