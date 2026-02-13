
import { LocationData, FeeStructure } from '../types';

// Helper to generate steps
const mainBlockSteps = (floor: string, direction: string, room: string) => [
  { instruction: 'Start at Main Block Ground Floor Lobby.', icon: 'straight' as const },
  { instruction: `Go to the ${floor}.`, icon: floor === 'Ground Floor' ? 'straight' as const : 'stairs-up' as const },
  { instruction: `Turn ${direction} in the corridor.`, icon: direction.includes('Left') ? 'turn-left' as const : 'turn-right' as const },
  { instruction: `The ${room} is ahead.`, icon: 'destination' as const }
];

// Helper to generate standardized rooms for a department
function createDeptLocations(code: string, program: 'B.Tech'|'M.Tech', fullName: string, floor: string): LocationData[] {
  const baseId = `${program.toLowerCase().replace('.', '')}-${code.toLowerCase()}`;
  const commonSteps = mainBlockSteps(floor, 'Straight', `${code} Department`);
  
  return [
    {
      id: `${baseId}-hod`,
      name: `${code} HOD Cabin (${program})`,
      block: 'Main Block',
      floor: floor,
      category: 'academic',
      department: code,
      program: program,
      aliases: [`${code} hod`, `${fullName} head`],
      distance: 100,
      estimatedTime: 2,
      steps: [...commonSteps, { instruction: 'The HOD Cabin is the first door in the wing.', icon: 'destination' }]
    },
    {
      id: `${baseId}-staff`,
      name: `${code} Staff Room`,
      block: 'Main Block',
      floor: floor,
      category: 'academic',
      department: code,
      program: program,
      aliases: [`${code} faculty`, `${fullName} teachers`],
      distance: 110,
      estimatedTime: 2,
      steps: [...commonSteps, { instruction: 'The Staff Room is located centrally in the wing.', icon: 'destination' }]
    },
    {
      id: `${baseId}-class`,
      name: `${code} Classrooms`,
      block: 'Main Block',
      floor: floor,
      category: 'academic',
      department: code,
      program: program,
      aliases: [`${code} class`, `${code} lecture hall`],
      distance: 120,
      estimatedTime: 2,
      steps: [...commonSteps, { instruction: 'Classrooms are located along the main corridor of this wing.', icon: 'destination' }]
    }
  ];
}

// Helper for Floor-wise Amenities
function createMainBlockAmenities(floor: string): LocationData[] {
    const suffix = floor.replace(/\s+/g, '-').toLowerCase();
    // Default direction for amenities usually central or ends
    const commonSteps = mainBlockSteps(floor, 'Straight', 'Utilities Area'); 

    return [
        {
            id: `washroom-boys-${suffix}`,
            name: `Boys Washroom (${floor})`,
            block: 'Main Block',
            floor: floor,
            category: 'amenity',
            aliases: ['boys toilet', 'gents washroom', 'men restroom'],
            distance: 50,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: 'Located near the central staircase.', icon: 'destination' }]
        },
        {
            id: `washroom-girls-${suffix}`,
            name: `Girls Washroom (${floor})`,
            block: 'Main Block',
            floor: floor,
            category: 'amenity',
            aliases: ['girls toilet', 'ladies washroom', 'women restroom'],
            distance: 55,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: 'Located at the end of the corridor.', icon: 'destination' }]
        },
        {
            id: `water-${suffix}`,
            name: `Drinking Water (${floor})`,
            block: 'Main Block',
            floor: floor,
            category: 'amenity',
            aliases: ['water cooler', 'ro water', 'drinking water', 'filter water'],
            distance: 45,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: 'Water outlet is located near the washrooms.', icon: 'destination' }]
        },
         {
            id: `girls-waiting-${suffix}`,
            name: `Girls Rest Room (${floor})`,
            block: 'Main Block',
            floor: floor,
            category: 'amenity',
            aliases: ['girls common room', 'waiting room', 'girls lounge'],
            distance: 60,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: 'Opposite to the Girls Washroom.', icon: 'destination' }]
        }
    ];
}

export const LOCATIONS: LocationData[] = [
  // =====================================================================
  // EXTERNAL BLOCKS (Direct Navigation)
  // =====================================================================
  {
    id: 'mba-block',
    name: 'MBA Block',
    block: 'MBA Block',
    floor: 'Ground',
    category: 'academic',
    program: 'MBA',
    aliases: ['mba', 'management block', 'business school'],
    distance: 150,
    estimatedTime: 3,
    mapImage: 'https://placehold.co/800x600/be123c/fff1f2?text=MBA+Block',
    steps: [
      { instruction: 'Exit Main Block.', icon: 'straight' },
      { instruction: 'Turn Right and cross the Students Parking.', icon: 'turn-right' },
      { instruction: 'The MBA Block is the building straight ahead.', icon: 'destination' }
    ]
  },
  {
    id: 'diploma-block',
    name: 'Diploma Block',
    block: 'Diploma Block',
    floor: 'Ground',
    category: 'academic',
    program: 'Diploma',
    aliases: ['polytechnic', 'diploma'],
    distance: 160,
    estimatedTime: 3,
    mapImage: 'https://placehold.co/800x600/c2410c/fff7ed?text=Diploma+Block',
    steps: [
      { instruction: 'Exit Main Block.', icon: 'straight' },
      { instruction: 'Turn Right.', icon: 'turn-right' },
      { instruction: 'Walk straight past the parking.', icon: 'straight' },
      { instruction: 'The Diploma Block is on your Right.', icon: 'destination' }
    ]
  },
  {
    id: 'grounds',
    name: 'College Ground',
    block: 'Grounds',
    floor: 'Open Area',
    category: 'amenity',
    aliases: ['playground', 'cricket', 'sports'],
    distance: 350,
    estimatedTime: 6,
    mapImage: 'https://placehold.co/800x600/3f6212/ecfccb?text=College+Ground',
    steps: [
      { instruction: 'Exit Main Block and Turn Right.', icon: 'turn-right' },
      { instruction: 'Walk past Diploma Block.', icon: 'straight' },
      { instruction: 'The Ground entrance is on your Left.', icon: 'destination' }
    ]
  },
  {
    id: 'canteen',
    name: 'Canteen',
    block: 'Amenities',
    floor: 'Ground',
    category: 'amenity',
    aliases: ['food', 'lunch', 'cafeteria'],
    distance: 300,
    estimatedTime: 5,
    mapImage: 'https://placehold.co/800x600/a16207/fefce8?text=Canteen',
    steps: [
      { instruction: 'Exit Main Block and Turn Right.', icon: 'turn-right' },
      { instruction: 'Cross Students Parking towards MBA Block.', icon: 'straight' },
      { instruction: 'Walk behind MBA Block to find the Canteen.', icon: 'destination' }
    ]
  },
  {
    id: 'mess',
    name: 'Student Mess',
    block: 'Amenities',
    floor: 'Ground',
    category: 'amenity',
    aliases: ['hostel mess', 'dining'],
    distance: 320,
    estimatedTime: 5,
    mapImage: 'https://placehold.co/800x600/a16207/fefce8?text=Mess',
    steps: [
      { instruction: 'Exit Main Block and Turn Right.', icon: 'turn-right' },
      { instruction: 'Walk past Diploma Block.', icon: 'straight' },
      { instruction: 'The Mess is the last building on your Right.', icon: 'destination' }
    ]
  },

  // =====================================================================
  // MAIN BLOCK - ADMINISTRATION
  // =====================================================================
  {
    id: 'principal-chamber',
    name: "Principal's Chamber",
    block: 'Main Block',
    floor: 'Ground Floor',
    category: 'administrative',
    aliases: ['principal', 'director'],
    distance: 40,
    estimatedTime: 1,
    steps: mainBlockSteps('Ground Floor', 'Right', "Principal's Office")
  },
  {
    id: 'admin-office',
    name: 'Administrative Office',
    block: 'Main Block',
    floor: 'Ground Floor',
    category: 'administrative',
    aliases: ['office', 'fees', 'accounts'],
    distance: 30,
    estimatedTime: 1,
    steps: mainBlockSteps('Ground Floor', 'Left', "Admin Office")
  },
  {
    id: 'exam-cell',
    name: 'Examination Cell',
    block: 'Main Block',
    floor: '1st Floor',
    category: 'administrative',
    aliases: ['exam section', 'results'],
    distance: 120,
    estimatedTime: 3,
    steps: mainBlockSteps('1st Floor', 'Left', "Exam Cell")
  },
  {
    id: 'placement-cell',
    name: 'Placement Cell',
    block: 'Main Block',
    floor: '2nd Floor',
    category: 'administrative',
    aliases: ['tpo', 'jobs', 'interview'],
    distance: 150,
    estimatedTime: 3,
    steps: mainBlockSteps('2nd Floor', 'Right', "Placement Cell")
  },

  // =====================================================================
  // MAIN BLOCK - ACADEMIC - B.TECH
  // =====================================================================
  
  // --- B.Tech CSE ---
  ...createDeptLocations('CSE', 'B.Tech', 'Computer Science & Engg', '3rd Floor'),
  // --- B.Tech ECE ---
  ...createDeptLocations('ECE', 'B.Tech', 'Electronics & Comm Engg', '2nd Floor'),
  // --- B.Tech EEE ---
  ...createDeptLocations('EEE', 'B.Tech', 'Electrical & Electronics', '1st Floor'),
  // --- B.Tech MECH ---
  ...createDeptLocations('MECH', 'B.Tech', 'Mechanical Engineering', 'Ground Floor'),
  // --- B.Tech CIVIL ---
  ...createDeptLocations('CIVIL', 'B.Tech', 'Civil Engineering', 'Ground Floor'),

  // =====================================================================
  // MAIN BLOCK - ACADEMIC - M.TECH
  // =====================================================================
  
  // --- M.Tech Depts ---
  ...createDeptLocations('CSE', 'M.Tech', 'Computer Science & Engg', '3rd Floor'),
  ...createDeptLocations('ECE', 'M.Tech', 'Digital Systems', '2nd Floor'),
  ...createDeptLocations('EPS', 'M.Tech', 'Power Systems', '1st Floor'),
  ...createDeptLocations('VLSI', 'M.Tech', 'VLSI & Embedded Systems', '2nd Floor'),
  ...createDeptLocations('SE', 'M.Tech', 'Structural Engineering', 'Ground Floor'),
  ...createDeptLocations('TE', 'M.Tech', 'Thermal Engineering', 'Ground Floor'),
  ...createDeptLocations('CAD', 'M.Tech', 'CAD/CAM', 'Ground Floor'),
  ...createDeptLocations('AIML', 'M.Tech', 'AI & Machine Learning', '3rd Floor'),

  // =====================================================================
  // MAIN BLOCK - AMENITIES (Floor Wise)
  // =====================================================================
  ...createMainBlockAmenities('Ground Floor'),
  ...createMainBlockAmenities('1st Floor'),
  ...createMainBlockAmenities('2nd Floor'),
  ...createMainBlockAmenities('3rd Floor'),

];

export const FEES: FeeStructure[] = [

  // ================================
  // B.TECH (AP EAPCET - 2025)
  // ================================
  { id: 'bt-civil', course: 'B.Tech', branch: 'CIVIL', seats: 60, annualFee: 43000 },
  { id: 'bt-cse', course: 'B.Tech', branch: 'CSE', seats: 240, annualFee: 43000 },
  { id: 'bt-cse-aiml', course: 'B.Tech', branch: 'CSE – AI & ML', seats: 60, annualFee: 43000 },
  { id: 'bt-cse-ds', course: 'B.Tech', branch: 'CSE – DATA SCIENCE', seats: 60, annualFee: 43000 },
  { id: 'bt-cse-cyber', course: 'B.Tech', branch: 'CSE – CYBER SECURITY', seats: 60, annualFee: 43000 },
  { id: 'bt-ece', course: 'B.Tech', branch: 'ECE', seats: 180, annualFee: 43000 },
  { id: 'bt-eee', course: 'B.Tech', branch: 'EEE', seats: 60, annualFee: 43000 },
  { id: 'bt-mech', course: 'B.Tech', branch: 'MECHANICAL ENGINEERING', seats: 150, annualFee: 43000 },

  // ================================
  // B.TECH LATERAL ENTRY (AP ECET - 2025)
  // ================================
  { id: 'btle-civil', course: 'B.Tech Lateral Entry', branch: 'CIVIL', seats: 61, annualFee: 43000 },
  { id: 'btle-cse', course: 'B.Tech Lateral Entry', branch: 'CSE', seats: 112, annualFee: 43000 },
  { id: 'btle-cse-aiml', course: 'B.Tech Lateral Entry', branch: 'CSE – AI & ML', seats: 17, annualFee: 43000 },
  { id: 'btle-cse-ds', course: 'B.Tech Lateral Entry', branch: 'CSE – DATA SCIENCE', seats: 33, annualFee: 43000 },
  { id: 'btle-cse-cyber', course: 'B.Tech Lateral Entry', branch: 'CSE – CYBER SECURITY', seats: 32, annualFee: 43000 },
  { id: 'btle-ece', course: 'B.Tech Lateral Entry', branch: 'ECE', seats: 121, annualFee: 43000 },
  { id: 'btle-eee', course: 'B.Tech Lateral Entry', branch: 'EEE', seats: 58, annualFee: 43000 },
  { id: 'btle-mech', course: 'B.Tech Lateral Entry', branch: 'MECHANICAL ENGINEERING', seats: 154, annualFee: 43000 },

  // ================================
  // M.TECH (PGECET - 2025)
  // ================================
  { id: 'mt-cadcam', course: 'M.Tech', branch: 'CAD / CAM', seats: 18, annualFee: 50000 },
  { id: 'mt-cse', course: 'M.Tech', branch: 'CSE', seats: 18, annualFee: 50000 },
  { id: 'mt-ps', course: 'M.Tech', branch: 'POWER SYSTEMS', seats: 18, annualFee: 50000 },
  { id: 'mt-struct', course: 'M.Tech', branch: 'STRUCTURAL ENGINEERING', seats: 36, annualFee: 50000 },
  { id: 'mt-vlsi', course: 'M.Tech', branch: 'VLSI', seats: 18, annualFee: 50000 },
  { id: 'mt-thermal', course: 'M.Tech', branch: 'THERMAL ENGINEERING', seats: 18, annualFee: 50000 },

  // ================================
  // MBA (ICET - 2025)
  // ================================
  { id: 'mba-hr', course: 'MBA', branch: 'HR', seats: 30, annualFee: 35000 },
  { id: 'mba-fin', course: 'MBA', branch: 'FINANCE', seats: 30, annualFee: 35000 },
  { id: 'mba-mkt', course: 'MBA', branch: 'MARKETING', seats: 30, annualFee: 35000 },
  { id: 'mba-log', course: 'MBA', branch: 'LOGISTICS & SUPPLY CHAIN MANAGEMENT', seats: 30, annualFee: 35000 },
  { id: 'mba-health', course: 'MBA', branch: 'HEALTH CARE & HOSPITAL MANAGEMENT', seats: 30, annualFee: 35000 },
  { id: 'mba-ba', course: 'MBA', branch: 'BUSINESS ANALYTICS / SYSTEMS', seats: 30, annualFee: 35000 },

  // ================================
  // DIPLOMA (Randomized as Requested)
  // ================================
  { id: 'dip-ece', course: 'Diploma', branch: 'ECE', seats: 60, annualFee: 25000 },
  { id: 'dip-civil', course: 'Diploma', branch: 'CIVIL', seats: 60, annualFee: 23000 },
  { id: 'dip-cme', course: 'Diploma', branch: 'CME', seats: 60, annualFee: 26000 },
  { id: 'dip-mech', course: 'Diploma', branch: 'MECH', seats: 60, annualFee: 24000 },
  { id: 'dip-it', course: 'Diploma', branch: 'IT', seats: 60, annualFee: 22000 },

];
