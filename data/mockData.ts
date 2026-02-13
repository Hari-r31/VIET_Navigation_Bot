
import { LocationData, FeeStructure } from '../types';

export const LOCATIONS: LocationData[] = [
  // --- Administrative ---
  {
    id: 'principal-chamber',
    name: 'Principal\'s Chamber',
    block: 'Main Campus',
    floor: 'Ground Floor',
    category: 'administrative',
    aliases: ['principal', 'head of institute', 'director'],
    distance: 50,
    estimatedTime: 1,
    mapImage: 'https://placehold.co/800x600/e0f2fe/0369a1?text=Map:+Principal+Chamber',
    steps: [
      { instruction: 'Enter Main Block', icon: 'straight' },
      { instruction: 'Turn left at reception', icon: 'turn-left' },
      { instruction: 'First door on the right', icon: 'destination' }
    ]
  },
  {
    id: 'admin-office',
    name: 'Administrative Office',
    block: 'Main Campus',
    floor: 'Ground Floor',
    category: 'administrative',
    aliases: ['admin', 'office', 'fees counter', 'accounts'],
    distance: 40,
    estimatedTime: 1,
    mapImage: 'https://placehold.co/800x600/fff7ed/c2410c?text=Map:+Main+Campus+Ground+Floor',
    steps: [
      { instruction: 'Turn left from the kiosk', icon: 'turn-left' },
      { instruction: 'Walk past the Director\'s office', icon: 'straight' },
      { instruction: 'The Admin Office is on the left', icon: 'destination' },
    ]
  },
  {
    id: 'ncc-room',
    name: 'NCC Office',
    block: 'Main Campus',
    floor: 'Ground Floor',
    category: 'administrative',
    aliases: ['ncc', 'national cadet corps'],
    distance: 100,
    estimatedTime: 2,
    mapImage: 'https://placehold.co/800x600/f0fdf4/15803d?text=Map:+NCC+Room',
    steps: [
      { instruction: 'Go to the rear exit of Ground Floor', icon: 'straight' },
      { instruction: 'Located near the sports room', icon: 'destination' }
    ]
  },
  {
    id: 'exam-cell',
    name: 'Examination Cell',
    block: 'Main Campus',
    floor: '1st Floor',
    category: 'administrative',
    aliases: ['exam section', 'results', 'marks'],
    distance: 150,
    estimatedTime: 3,
    mapImage: 'https://placehold.co/800x600/fdf4ff/701a75?text=Map:+Exam+Cell',
    steps: [
      { instruction: 'Take main stairs to 1st floor', icon: 'stairs-up' },
      { instruction: 'Turn right', icon: 'turn-right' },
      { instruction: 'Walk to the end of the corridor', icon: 'destination' }
    ]
  },

  // --- ECE Department ---
  {
    id: 'ece-hod',
    name: 'ECE HOD Cabin',
    block: 'Main Campus',
    floor: '2nd Floor',
    category: 'academic',
    department: 'ECE',
    aliases: ['ece hod', 'ece head', 'electronics hod'],
    distance: 120,
    estimatedTime: 3,
    mapImage: 'https://placehold.co/800x600/e0f2fe/0369a1?text=Map:+Main+Campus+Block+2nd+Floor',
    steps: [
      { instruction: 'Go straight from the main entrance', detail: 'Walk 20 meters past the reception', icon: 'straight' },
      { instruction: 'Take the stairs to the 1st floor', detail: 'Main staircase located near the lobby', icon: 'stairs-up' },
      { instruction: 'Turn left after the washroom', detail: 'Follow the corridor', icon: 'turn-left' },
      { instruction: 'Take the stairs to the 2nd floor', detail: 'End of the corridor', icon: 'stairs-up' },
      { instruction: 'The HOD Cabin is on your right', detail: 'Room 204', icon: 'destination' },
    ]
  },
  {
    id: 'ece-staff',
    name: 'ECE Staff Room',
    block: 'Main Campus',
    floor: '2nd Floor',
    category: 'academic',
    department: 'ECE',
    aliases: ['ece faculty', 'teachers'],
    distance: 130,
    estimatedTime: 3,
    mapImage: 'https://placehold.co/800x600/e0f2fe/0369a1?text=Map:+ECE+Staff+Room',
    steps: [
      { instruction: 'Take stairs to 2nd Floor', icon: 'stairs-up' },
      { instruction: 'Turn Right', icon: 'turn-right' },
      { instruction: 'Room 205 adjacent to HOD cabin', icon: 'destination' }
    ]
  },
  {
    id: 'ece-lab-1',
    name: 'VLSI & Embedded Systems Lab',
    block: 'Main Campus',
    floor: '2nd Floor',
    category: 'academic',
    department: 'ECE',
    aliases: ['vlsi lab', 'embedded lab', 'ece lab'],
    distance: 140,
    estimatedTime: 3,
    mapImage: 'https://placehold.co/800x600/e0f2fe/0369a1?text=Map:+VLSI+Lab',
    steps: [
      { instruction: 'Take stairs to 2nd Floor', icon: 'stairs-up' },
      { instruction: 'Go straight to the end of left wing', icon: 'straight' }
    ]
  },

  // --- CSE Department ---
  {
    id: 'cse-hod',
    name: 'CSE HOD Cabin',
    block: 'Main Campus',
    floor: '3rd Floor',
    category: 'academic',
    department: 'CSE',
    aliases: ['cse head', 'computer hod'],
    distance: 180,
    estimatedTime: 4,
    mapImage: 'https://placehold.co/800x600/e0f2fe/0369a1?text=Map:+CSE+HOD',
    steps: [
      { instruction: 'Take elevator to 3rd Floor', icon: 'stairs-up' },
      { instruction: 'Turn left', icon: 'turn-left' },
      { instruction: 'First room on the left', icon: 'destination' }
    ]
  },
  {
    id: 'cse-lab-1',
    name: 'AI & ML Lab',
    block: 'Main Campus',
    floor: '3rd Floor',
    category: 'academic',
    department: 'CSE',
    aliases: ['computer lab', 'ai lab'],
    distance: 200,
    estimatedTime: 5,
    mapImage: 'https://placehold.co/800x600/e0f2fe/0369a1?text=Map:+AI+Lab',
    steps: [
      { instruction: 'Take elevator to 3rd Floor', icon: 'stairs-up' },
      { instruction: 'Walk straight past the library', icon: 'straight' }
    ]
  },

  // --- EEE Department ---
  {
    id: 'eee-hod',
    name: 'EEE HOD Cabin',
    block: 'Main Campus',
    floor: '1st Floor',
    category: 'academic',
    department: 'EEE',
    aliases: ['electrical hod'],
    distance: 90,
    estimatedTime: 2,
    mapImage: 'https://placehold.co/800x600/e0f2fe/0369a1?text=Map:+EEE+HOD',
    steps: [
      { instruction: 'Take stairs to 1st Floor', icon: 'stairs-up' },
      { instruction: 'Turn left', icon: 'turn-left' },
      { instruction: 'Room 102', icon: 'destination' }
    ]
  },

  // --- Amenities ---
  {
    id: 'library',
    name: 'Central Library',
    block: 'Main Campus',
    floor: '3rd Floor',
    category: 'amenity',
    aliases: ['library', 'books', 'reading room'],
    distance: 200,
    estimatedTime: 5,
    mapImage: 'https://placehold.co/800x600/f0fdf4/15803d?text=Map:+Main+Campus+Block+3rd+Floor',
    steps: [
      { instruction: 'Go straight towards the elevators', icon: 'straight' },
      { instruction: 'Take the elevator to the 3rd floor', icon: 'stairs-up' },
      { instruction: 'Turn right immediately', icon: 'turn-right' },
      { instruction: 'Walk to the end of the hall', icon: 'straight' },
      { instruction: 'Entrance is double glass doors', icon: 'destination' },
    ]
  },
  {
    id: 'girls-waiting',
    name: 'Girls Waiting Room',
    block: 'Main Campus',
    floor: 'Ground Floor',
    category: 'amenity',
    aliases: ['waiting hall', 'restroom'],
    distance: 60,
    estimatedTime: 2,
    mapImage: 'https://placehold.co/800x600/f0fdf4/15803d?text=Map:+Girls+Waiting',
    steps: [
      { instruction: 'Right wing of Ground Floor', icon: 'turn-right' }
    ]
  },
  {
    id: 'seminar-hall',
    name: 'Seminar Hall 1',
    block: 'Main Campus',
    floor: '1st Floor',
    category: 'academic',
    department: 'Common',
    aliases: ['seminar hall', 'auditorium', 'hall'],
    distance: 80,
    estimatedTime: 2,
    mapImage: 'https://placehold.co/800x600/faf5ff/7e22ce?text=Map:+Main+Campus+1st+Floor',
    steps: [
      { instruction: 'Take the main stairs to 1st floor', icon: 'stairs-up' },
      { instruction: 'Turn right', icon: 'turn-right' },
      { instruction: 'It is the first large door on the left', icon: 'destination' },
    ]
  },

  // --- External Blocks ---
  {
    id: 'mba-block',
    name: 'MBA Block',
    block: 'MBA Building',
    floor: 'Ground',
    category: 'academic',
    aliases: ['mba', 'management block'],
    distance: 400,
    estimatedTime: 8,
    mapImage: 'https://placehold.co/800x600/fff1f2/be123c?text=Map:+MBA+Block+Overview',
    steps: [
      { instruction: 'Exit the Main Campus building from the rear gate', icon: 'straight' },
      { instruction: 'Cross the parking lot', icon: 'straight' },
      { instruction: 'The MBA block is the red brick building ahead', icon: 'destination' },
    ]
  },
  {
    id: 'canteen',
    name: 'College Canteen',
    block: 'Grounds',
    floor: 'Ground',
    category: 'amenity',
    aliases: ['canteen', 'food', 'cafeteria', 'mess', 'lunch'],
    distance: 150,
    estimatedTime: 4,
    mapImage: 'https://placehold.co/800x600/fefce8/a16207?text=Map:+Campus+Grounds',
    steps: [
      { instruction: 'Exit via the side entrance', icon: 'turn-right' },
      { instruction: 'Follow the paved path', icon: 'straight' },
      { instruction: 'The Canteen is the circular building', icon: 'destination' },
    ]
  }
];

export const FEES: FeeStructure[] = [
  // B.Tech Data from Prompt
  { 
    id: 'bt-cse', 
    course: 'B.Tech', 
    branch: 'CSE', 
    seats: 125, 
    annualFee: 120000, 
    description: 'Computer Science & Engineering' 
  },
  { 
    id: 'bt-ece', 
    course: 'B.Tech', 
    branch: 'ECE', 
    seats: 90, 
    annualFee: 80000, 
    description: 'Electronics & Communication Engineering'
  },
  { 
    id: 'bt-eee', 
    course: 'B.Tech', 
    branch: 'EEE', 
    seats: 65, 
    annualFee: 70000, 
    description: 'Electrical & Electronics Engineering'
  },
  { 
    id: 'bt-mech', 
    course: 'B.Tech', 
    branch: 'MECH', 
    seats: 50, 
    annualFee: 70000, 
    description: 'Mechanical Engineering'
  },
  
  // Dummy data for other courses to ensure app robustness if selected
  { id: 'mba-gen', course: 'MBA', branch: 'General', seats: 60, annualFee: 50000, description: 'Master of Business Administration' },
  { id: 'dip-ece', course: 'Diploma', branch: 'ECE', seats: 60, annualFee: 27000, description: 'Diploma in Electronics' },
];
