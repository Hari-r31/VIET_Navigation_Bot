
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
  program?: 'B.Tech' | 'M.Tech' | 'Diploma' | 'MBA'; // New field for hierarchy
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
  annualFee: number; // Convenor Fee
  managementFee?: number;
  spotFee?: number;
  description?: string;
}

// --- Agent Types ---

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isTyping?: boolean;
  timestamp: number;
  options?: string[]; // For UI chips/suggestions
}
