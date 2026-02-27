
import { LocationData, FeeStructure } from '../types';

type Language = 'en' | 'te' | 'hi';

const DICTIONARY = {
  en: {
    mainBlock: 'Main Block',
    mbaBlock: 'MBA Block',
    diplomaBlock: 'Diploma Block',
    campusFacilities: 'Campus Facilities',
    groundFloor: 'Ground Floor',
    firstFloor: '1st Floor',
    secondFloor: '2nd Floor',
    thirdFloor: '3rd Floor',
    openArea: 'Open Area',
    start: 'Start at Main Block Ground Floor Lobby.',
    goTo: 'Go to the',
    turn: 'Turn',
    inCorridor: 'in the corridor.',
    ahead: 'is ahead.',
    right: 'Right',
    left: 'Left',
    straight: 'Straight',
    hodCabin: 'HOD Cabin',
    staffRoom: 'Staff Room',
    classrooms: 'Classrooms',
    wingFirst: 'The HOD Cabin is the first door in the wing.',
    wingCenter: 'The Staff Room is located centrally in the wing.',
    wingCorridor: 'Classrooms are located along the main corridor of this wing.',
    adminSection: 'Admin',
    dept: 'Department',
    utils: 'Utilities Area',
    washroomBoys: 'Boys Washroom',
    washroomGirls: 'Girls Washroom',
    drinkingWater: 'Drinking Water',
    girlsRestRoom: 'Girls Rest Room',
    locBoysWashroom: 'Located near the central staircase.',
    locGirlsWashroom: 'Located at the end of the corridor.',
    locWater: 'Water outlet is located near the washrooms.',
    locGirlsRest: 'Opposite to the Girls Washroom.',
    exitMain: 'Exit Main Block.',
    crossParking: 'Turn Right and cross the Students Parking.',
    mbaAhead: 'The MBA Block is the building straight ahead.',
    pastParking: 'Walk straight past the parking.',
    dipRight: 'The Diploma Block is on your Right.',
    exitRight: 'Exit Main Block and Turn Right.',
    pastDiploma: 'Walk past Diploma Block.',
    groundLeft: 'The Ground entrance is on your Left.',
    behindMba: 'Walk behind MBA Block to find the Canteen.',
    messRight: 'The Mess is the last building on your Right.',
    principalOffice: "Principal's Office",
    adminOffice: "Admin Office",
    examCell: "Exam Cell",
    placementCell: "Placement Cell"
  },
  te: {
    mainBlock: 'మెయిన్ బ్లాక్',
    mbaBlock: 'MBA బ్లాక్',
    diplomaBlock: 'డిప్లొమా బ్లాక్',
    campusFacilities: 'క్యాంపస్ సౌకర్యాలు',
    groundFloor: 'గ్రౌండ్ ఫ్లోర్',
    firstFloor: '1వ అంతస్తు',
    secondFloor: '2వ అంతస్తు',
    thirdFloor: '3వ అంతస్తు',
    openArea: 'బయట ప్రాంగణం',
    start: 'మెయిన్ బ్లాక్ గ్రౌండ్ ఫ్లోర్ లాబీలో ప్రారంభించండి.',
    goTo: 'వెళ్ళండి:',
    turn: 'తిరగండి:',
    inCorridor: 'కారిడార్‌లో.',
    ahead: 'ముందు ఉంది.',
    right: 'కుడివైపు (Right)',
    left: 'ఎడమవైపు (Left)',
    straight: 'నేరుగా (Straight)',
    hodCabin: 'HOD క్యాబిన్',
    staffRoom: 'స్టాఫ్ రూమ్',
    classrooms: 'తరగతి గదులు',
    wingFirst: 'HOD క్యాబిన్ ఈ వింగ్‌లో మొదటి తలుపు.',
    wingCenter: 'స్టాఫ్ రూమ్ ఈ వింగ్ మధ్యలో ఉంది.',
    wingCorridor: 'తరగతి గదులు ఈ వింగ్ ప్రధాన కారిడార్‌లో ఉన్నాయి.',
    adminSection: 'అడ్మిన్',
    dept: 'విభాగం',
    utils: 'యుటిలిటీస్ ఏరియా',
    washroomBoys: 'బాలుర వాష్‌రూమ్',
    washroomGirls: 'బాలికల వాష్‌రూమ్',
    drinkingWater: 'త్రాగు నీరు',
    girlsRestRoom: 'బాలికల విశ్రాంతి గది',
    locBoysWashroom: 'సెంట్రల్ మెట్ల దగ్గర ఉంది.',
    locGirlsWashroom: 'కారిడార్ చివరలో ఉంది.',
    locWater: 'వాష్‌రూమ్‌ల దగ్గర నీటి సదుపాయం ఉంది.',
    locGirlsRest: 'బాలికల వాష్‌రూమ్‌కు ఎదురుగా ఉంది.',
    exitMain: 'మెయిన్ బ్లాక్ నుండి బయటకు రండి.',
    crossParking: 'కుడివైపు తిరిగి పార్కింగ్ దాటండి.',
    mbaAhead: 'MBA బ్లాక్ నేరుగా ముందు ఉన్న భవనం.',
    pastParking: 'పార్కింగ్ దాటి నేరుగా నడవండి.',
    dipRight: 'డిప్లొమా బ్లాక్ మీ కుడి వైపున ఉంది.',
    exitRight: 'మెయిన్ బ్లాక్ నుండి బయటకు వచ్చి కుడివైపు తిరగండి.',
    pastDiploma: 'డిప్లొమా బ్లాక్ దాటి నడవండి.',
    groundLeft: 'గ్రౌండ్ ప్రవేశం మీ ఎడమ వైపున ఉంది.',
    behindMba: 'క్యాంటీన్ కోసం MBA బ్లాక్ వెనుక వైపు నడవండి.',
    messRight: 'మెస్ మీ కుడి వైపున చివరి భవనం.',
    principalOffice: "ప్రిన్సిపాల్ ఆఫీస్",
    adminOffice: "అడ్మిన్ ఆఫీస్",
    examCell: "పరీక్షల విభాగం",
    placementCell: "ప్లేస్‌మెంట్ సెల్"
  },
  hi: {
    mainBlock: 'मेन ब्लॉक',
    mbaBlock: 'MBA ब्लॉक',
    diplomaBlock: 'डिप्लोमा ब्लॉक',
    campusFacilities: 'कैंपस सुविधाएं',
    groundFloor: 'ग्राउंड फ्लोर',
    firstFloor: 'पहली मंजिल',
    secondFloor: 'दूसरी मंजिल',
    thirdFloor: 'तीसरी मंजिल',
    openArea: 'खुला क्षेत्र',
    start: 'मेन ब्लॉक ग्राउंड फ्लोर लॉबी से शुरू करें।',
    goTo: 'जाएं:',
    turn: 'मुड़ें:',
    inCorridor: 'गलियारे में।',
    ahead: 'आगे है।',
    right: 'दाएं (Right)',
    left: 'बाएं (Left)',
    straight: 'सीधे (Straight)',
    hodCabin: 'HOD केबिन',
    staffRoom: 'स्टाफ रूम',
    classrooms: 'क्लासरूम',
    wingFirst: 'HOD केबिन इस विंग में पहला दरवाजा है।',
    wingCenter: 'स्टाफ रूम विंग के बीच में स्थित है।',
    wingCorridor: 'क्लासरूम इस विंग के मुख्य गलियारे में हैं।',
    adminSection: 'एडमिन',
    dept: 'विभाग',
    utils: 'सुविधा क्षेत्र',
    washroomBoys: 'लड़कों का वॉशरूम',
    washroomGirls: 'लड़कियों का वॉशरूम',
    drinkingWater: ' पीने का पानी',
    girlsRestRoom: 'गर्ल्स रेस्ट रूम',
    locBoysWashroom: 'केंद्रीय सीढ़ियों के पास स्थित है।',
    locGirlsWashroom: 'गलियारे के अंत में स्थित है।',
    locWater: 'पानी की सुविधा वॉशरूम के पास है।',
    locGirlsRest: 'गर्ल्स वॉशरूम के सामने।',
    exitMain: 'मेन ब्लॉक से बाहर निकलें।',
    crossParking: 'दाएं मुड़ें और पार्किंग पार करें।',
    mbaAhead: 'MBA ब्लॉक सीधे सामने वाली इमारत है।',
    pastParking: 'पार्किंग के आगे सीधे चलें।',
    dipRight: 'डिप्लोमा ब्लॉक आपके दाईं ओर है।',
    exitRight: 'मेन ब्लॉक से बाहर निकलें और दाएं मुड़ें।',
    pastDiploma: 'डिप्लोमा ब्लॉक के आगे चलें।',
    groundLeft: 'मैदान का प्रवेश द्वार आपके बाईं ओर है।',
    behindMba: 'कैंटीन के लिए MBA ब्लॉक के पीछे चलें।',
    messRight: 'मेस आपके दाईं ओर आखिरी इमारत है।',
    principalOffice: "प्रिंसिपल ऑफिस",
    adminOffice: "एडमिन ऑफिस",
    examCell: "परीक्षा कक्ष",
    placementCell: "प्लेसमेंट सेल"
  }
};

// Helper to generate steps with localization
const mainBlockSteps = (floorKey: string, directionKey: 'right' | 'left' | 'straight', roomName: string, lang: Language) => {
  const d = DICTIONARY[lang];
  // Map floor key to localized floor name
  const floorName = d[floorKey as keyof typeof d] || floorKey;
  const direction = d[directionKey];

  return [
    { instruction: d.start, icon: 'straight' as const },
    { instruction: `${d.goTo} ${floorName}.`, icon: floorKey === 'groundFloor' ? 'straight' as const : 'stairs-up' as const },
    { instruction: `${d.turn} ${direction} ${d.inCorridor}`, icon: directionKey === 'left' ? 'turn-left' as const : 'turn-right' as const },
    { instruction: `${roomName} ${d.ahead}`, icon: 'destination' as const }
  ];
};

// Helper to generate standardized rooms for a department
function createDeptLocations(code: string, program: 'B.Tech'|'M.Tech', fullName: string, floorKey: string, lang: Language): LocationData[] {
  const d = DICTIONARY[lang];
  const floorName = d[floorKey as keyof typeof d] || floorKey;
  const baseId = `${program.toLowerCase().replace('.', '')}-${code.toLowerCase()}`;
  
  // Localized Department Name wrapper
  const deptName = `${code} ${d.dept}`;
  const commonSteps = mainBlockSteps(floorKey, 'straight', deptName, lang);
  
  return [
    {
      id: `${baseId}-hod`,
      name: `${code} ${d.hodCabin} (${program})`,
      block: d.mainBlock,
      floor: floorName,
      category: 'academic',
      department: code,
      program: program,
      aliases: [`${code} hod`, `${fullName} head`],
      distance: 100,
      estimatedTime: 2,
      steps: [...commonSteps, { instruction: d.wingFirst, icon: 'destination' }]
    },
    {
      id: `${baseId}-staff`,
      name: `${code} ${d.staffRoom}`,
      block: d.mainBlock,
      floor: floorName,
      category: 'academic',
      department: code,
      program: program,
      aliases: [`${code} faculty`, `${fullName} teachers`],
      distance: 110,
      estimatedTime: 2,
      steps: [...commonSteps, { instruction: d.wingCenter, icon: 'destination' }]
    },
    {
      id: `${baseId}-class`,
      name: `${code} ${d.classrooms}`,
      block: d.mainBlock,
      floor: floorName,
      category: 'academic',
      department: code,
      program: program,
      aliases: [`${code} class`, `${code} lecture hall`],
      distance: 120,
      estimatedTime: 2,
      steps: [...commonSteps, { instruction: d.wingCorridor, icon: 'destination' }]
    }
  ];
}

// Helper for Floor-wise Amenities
function createMainBlockAmenities(floorKey: string, lang: Language): LocationData[] {
    const d = DICTIONARY[lang];
    const floorName = d[floorKey as keyof typeof d] || floorKey;
    const suffix = floorKey; // Internal ID suffix
    const commonSteps = mainBlockSteps(floorKey, 'straight', d.utils, lang); 

    return [
        {
            id: `washroom-boys-${suffix}`,
            name: `${d.washroomBoys} (${floorName})`,
            block: d.mainBlock,
            floor: floorName,
            category: 'amenity',
            aliases: ['boys toilet', 'gents washroom', 'men restroom'],
            distance: 50,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: d.locBoysWashroom, icon: 'destination' }]
        },
        {
            id: `washroom-girls-${suffix}`,
            name: `${d.washroomGirls} (${floorName})`,
            block: d.mainBlock,
            floor: floorName,
            category: 'amenity',
            aliases: ['girls toilet', 'ladies washroom', 'women restroom'],
            distance: 55,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: d.locGirlsWashroom, icon: 'destination' }]
        },
        {
            id: `water-${suffix}`,
            name: `${d.drinkingWater} (${floorName})`,
            block: d.mainBlock,
            floor: floorName,
            category: 'amenity',
            aliases: ['water cooler', 'ro water', 'drinking water', 'filter water'],
            distance: 45,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: d.locWater, icon: 'destination' }]
        },
         {
            id: `girls-waiting-${suffix}`,
            name: `${d.girlsRestRoom} (${floorName})`,
            block: d.mainBlock,
            floor: floorName,
            category: 'amenity',
            aliases: ['girls common room', 'waiting room', 'girls lounge'],
            distance: 60,
            estimatedTime: 1,
            steps: [...commonSteps, { instruction: d.locGirlsRest, icon: 'destination' }]
        }
    ];
}

// =====================================================================
// DYNAMIC LOCATION GENERATOR
// =====================================================================

export const getLocations = (lang: Language = 'en'): LocationData[] => {
  const d = DICTIONARY[lang];

  return [
    // --- EXTERNAL BLOCKS ---
    {
      id: 'mba-block',
      name: d.mbaBlock,
      block: d.mbaBlock,
      floor: d.groundFloor,
      category: 'academic',
      program: 'MBA',
      aliases: ['mba', 'management block', 'business school'],
      distance: 150,
      estimatedTime: 3,
      mapImage: 'https://placehold.co/800x600/be123c/fff1f2?text=MBA+Block',
      steps: [
        { instruction: d.exitMain, icon: 'straight' },
        { instruction: d.crossParking, icon: 'turn-right' },
        { instruction: d.mbaAhead, icon: 'destination' }
      ]
    },
    {
      id: 'diploma-block',
      name: d.diplomaBlock,
      block: d.diplomaBlock,
      floor: d.groundFloor,
      category: 'academic',
      program: 'Diploma',
      aliases: ['polytechnic', 'diploma'],
      distance: 160,
      estimatedTime: 3,
      mapImage: 'https://placehold.co/800x600/c2410c/fff7ed?text=Diploma+Block',
      steps: [
        { instruction: d.exitMain, icon: 'straight' },
        { instruction: d.exitRight.replace('Exit Main Block and ', ''), icon: 'turn-right' }, // reuse part
        { instruction: d.pastParking, icon: 'straight' },
        { instruction: d.dipRight, icon: 'destination' }
      ]
    },
    {
      id: 'grounds',
      name: lang === 'en' ? 'College Ground' : (lang === 'te' ? 'కాలేజ్ గ్రౌండ్' : 'कॉलेज ग्राउंड'),
      block: d.campusFacilities,
      floor: d.openArea,
      category: 'amenity',
      aliases: ['playground', 'cricket', 'sports'],
      distance: 350,
      estimatedTime: 6,
      mapImage: 'https://placehold.co/800x600/3f6212/ecfccb?text=College+Ground',
      steps: [
        { instruction: d.exitRight, icon: 'turn-right' },
        { instruction: d.pastDiploma, icon: 'straight' },
        { instruction: d.groundLeft, icon: 'destination' }
      ]
    },
    {
      id: 'canteen',
      name: lang === 'en' ? 'Canteen' : (lang === 'te' ? 'క్యాంటీన్' : 'कैंटीन'),
      block: d.campusFacilities,
      floor: d.groundFloor,
      category: 'amenity',
      aliases: ['food', 'lunch', 'cafeteria'],
      distance: 300,
      estimatedTime: 5,
      mapImage: 'https://placehold.co/800x600/a16207/fefce8?text=Canteen',
      steps: [
        { instruction: d.exitRight, icon: 'turn-right' },
        { instruction: d.crossParking, icon: 'straight' },
        { instruction: d.behindMba, icon: 'destination' }
      ]
    },
    {
      id: 'mess',
      name: lang === 'en' ? 'Student Mess' : (lang === 'te' ? 'మెస్' : 'मेस'),
      block: d.campusFacilities,
      floor: d.groundFloor,
      category: 'amenity',
      aliases: ['hostel mess', 'dining'],
      distance: 320,
      estimatedTime: 5,
      mapImage: 'https://placehold.co/800x600/a16207/fefce8?text=Mess',
      steps: [
        { instruction: d.exitRight, icon: 'turn-right' },
        { instruction: d.pastDiploma, icon: 'straight' },
        { instruction: d.messRight, icon: 'destination' }
      ]
    },

    // --- MAIN BLOCK ADMIN ---
    {
      id: 'principal-chamber',
      name: d.principalOffice,
      block: d.mainBlock,
      floor: d.groundFloor,
      category: 'administrative',
      aliases: ['principal', 'director'],
      distance: 40,
      estimatedTime: 1,
      steps: mainBlockSteps('groundFloor', 'right', d.principalOffice, lang)
    },
    {
      id: 'admin-office',
      name: d.adminOffice,
      block: d.mainBlock,
      floor: d.groundFloor,
      category: 'administrative',
      aliases: ['office', 'fees', 'accounts'],
      distance: 30,
      estimatedTime: 1,
      steps: mainBlockSteps('groundFloor', 'left', d.adminOffice, lang)
    },
    {
      id: 'exam-cell',
      name: d.examCell,
      block: d.mainBlock,
      floor: d.firstFloor,
      category: 'administrative',
      aliases: ['exam section', 'results'],
      distance: 120,
      estimatedTime: 3,
      steps: mainBlockSteps('firstFloor', 'left', d.examCell, lang)
    },
    {
      id: 'placement-cell',
      name: d.placementCell,
      block: d.mainBlock,
      floor: d.secondFloor,
      category: 'administrative',
      aliases: ['tpo', 'jobs', 'interview'],
      distance: 150,
      estimatedTime: 3,
      steps: mainBlockSteps('secondFloor', 'right', d.placementCell, lang)
    },

    // --- ACADEMIC B.TECH ---
    ...createDeptLocations('CSE', 'B.Tech', 'Computer Science & Engg', 'thirdFloor', lang),
    ...createDeptLocations('ECE', 'B.Tech', 'Electronics & Comm Engg', 'secondFloor', lang),
    ...createDeptLocations('EEE', 'B.Tech', 'Electrical & Electronics', 'firstFloor', lang),
    ...createDeptLocations('MECH', 'B.Tech', 'Mechanical Engineering', 'groundFloor', lang),
    ...createDeptLocations('CIVIL', 'B.Tech', 'Civil Engineering', 'groundFloor', lang),

    // --- ACADEMIC M.TECH ---
    ...createDeptLocations('CSE', 'M.Tech', 'Computer Science & Engg', 'thirdFloor', lang),
    ...createDeptLocations('ECE', 'M.Tech', 'Digital Systems', 'secondFloor', lang),
    ...createDeptLocations('EPS', 'M.Tech', 'Power Systems', 'firstFloor', lang),
    ...createDeptLocations('VLSI', 'M.Tech', 'VLSI & Embedded Systems', 'secondFloor', lang),
    ...createDeptLocations('SE', 'M.Tech', 'Structural Engineering', 'groundFloor', lang),
    ...createDeptLocations('TE', 'M.Tech', 'Thermal Engineering', 'groundFloor', lang),
    ...createDeptLocations('CAD', 'M.Tech', 'CAD/CAM', 'groundFloor', lang),
    ...createDeptLocations('AIML', 'M.Tech', 'AI & Machine Learning', 'thirdFloor', lang),

    // --- AMENITIES ---
    ...createMainBlockAmenities('groundFloor', lang),
    ...createMainBlockAmenities('firstFloor', lang),
    ...createMainBlockAmenities('secondFloor', lang),
    ...createMainBlockAmenities('thirdFloor', lang),
  ];
};

// Backwards compatibility for existing imports (Default to English)
export const LOCATIONS: LocationData[] = getLocations('en');

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
