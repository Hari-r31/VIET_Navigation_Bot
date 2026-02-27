
import Fuse from 'fuse.js';
import { LOCATIONS } from '../data/mockData';
import { LocationData } from '../types';

const options = {
  includeScore: true,
  keys: ['name', 'aliases', 'block', 'department'],
  threshold: 0.4, // 0.0 is perfect match, 1.0 is match anything
};

// Default Fuse instance for English/Fallback
const defaultFuse = new Fuse(LOCATIONS, options);

export const searchLocations = (query: string, customLocations?: LocationData[]): LocationData[] => {
  if (!query) return [];
  
  // If custom locations are provided (e.g. for a specific language), use them
  const fuseInstance = customLocations ? new Fuse(customLocations, options) : defaultFuse;
  
  const results = fuseInstance.search(query);
  return results.map(result => result.item);
};

export const getAllLocations = (): LocationData[] => {
  return LOCATIONS.sort((a, b) => a.name.localeCompare(b.name));
};

export const getLocationById = (id: string): LocationData | undefined => {
  return LOCATIONS.find(loc => loc.id === id);
};
