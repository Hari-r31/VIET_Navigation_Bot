import Fuse from 'fuse.js';
import { LOCATIONS } from '../data/mockData';
import { LocationData } from '../types';

const options = {
  includeScore: true,
  keys: ['name', 'aliases', 'block', 'department'],
  threshold: 0.4, // 0.0 is perfect match, 1.0 is match anything
};

const fuse = new Fuse(LOCATIONS, options);

export const searchLocations = (query: string): LocationData[] => {
  if (!query) return [];
  const results = fuse.search(query);
  return results.map(result => result.item);
};

export const getAllLocations = (): LocationData[] => {
  return LOCATIONS.sort((a, b) => a.name.localeCompare(b.name));
};

export const getLocationById = (id: string): LocationData | undefined => {
  return LOCATIONS.find(loc => loc.id === id);
};