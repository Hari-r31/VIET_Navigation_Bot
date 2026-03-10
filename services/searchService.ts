
import Fuse from 'fuse.js';
import { LOCATIONS } from '../data/mockData';
import { LocationData } from '../types';

const options = {
  includeScore: true,
  keys: [
    { name: 'name', weight: 0.6 },
    { name: 'aliases', weight: 0.4 },
    { name: 'department', weight: 0.3 },
    { name: 'block', weight: 0.2 }
  ],
  threshold: 0.4, // 0.0 is perfect match, 1.0 is match anything
  ignoreLocation: true, // Search anywhere in the string
  minMatchCharLength: 2,
};

// Default Fuse instance for English/Fallback
const defaultFuse = new Fuse(LOCATIONS, options);

const cleanQuery = (query: string): string => {
  let cleaned = query.toLowerCase();
  const prefixesToRemove = [
    'navigate to', 'take me to', 'where is', 'how to go to', 'how to reach', 
    'directions to', 'show me', 'find', 'search for',
    'నావిగేట్ చేయి', 'ఎక్కడ ఉంది', 'ఎలా వెళ్ళాలి',
    'नेविगेट करें', 'कहाँ है', 'कैसे जाएं'
  ];
  
  for (const prefix of prefixesToRemove) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.replace(prefix, '').trim();
    } else if (cleaned.includes(prefix)) {
      cleaned = cleaned.replace(prefix, '').trim();
    }
  }
  
  // Remove trailing words like "please", "room", "block" if they are just noise, 
  // but be careful not to remove actual names like "MBA block".
  // For now, just removing the prefixes is usually enough.
  return cleaned || query; // fallback to original if cleaned is empty
};

export const searchLocations = (query: string, customLocations?: LocationData[]): LocationData[] => {
  if (!query) return [];
  
  const cleanedQuery = cleanQuery(query);
  
  // If custom locations are provided (e.g. for a specific language), use them
  const fuseInstance = customLocations ? new Fuse(customLocations, options) : defaultFuse;
  
  const results = fuseInstance.search(cleanedQuery);
  return results.map(result => result.item);
};

export const getAllLocations = (): LocationData[] => {
  return LOCATIONS.sort((a, b) => a.name.localeCompare(b.name));
};

export const getLocationById = (id: string): LocationData | undefined => {
  return LOCATIONS.find(loc => loc.id === id);
};
