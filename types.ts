
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

export enum IntentType {
  NAVIGATE = 'NAVIGATE',
  FEE = 'FEE',
  UNKNOWN = 'UNKNOWN'
}

export interface IntentResult {
  type: IntentType;
  entity?: string; // extracted location or course info
  confidence: number;
}
