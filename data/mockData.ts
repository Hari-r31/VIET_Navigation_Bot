
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
    fourthFloor: '4th Floor',
    basement: 'Basement',
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
    placementCell: "Placement Cell",
    // New Direction Keys
    turnLeftMain: "Turn Left from Main Entrance.",
    turnRightMain: "Turn Right from Main Entrance.",
    walkRooms: "Walk {n} rooms.",
    roomLeft: "{n} room on the left.",
    roomRight: "{n} room on the right.",
    turnLeftStairs: "Turn Left from stairs.",
    turnRightStairs: "Turn Right from stairs.",
    topCorridor: "Located in Top Corridor.",
    leftSide: "Left side.",
    rightSide: "Right side.",
    walkStraight: "Walk straight.",
    nearStairs: "Located near stairs.",
    endOfCorridor: "End of the corridor.",
    oppWashroom: "Opposite to Washroom.",
    adjLibrary: "Adjacent to Library.",
    bottomCorridor: "Located in Bottom Corridor."
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
    fourthFloor: '4వ అంతస్తు',
    basement: 'బేస్‌మెంట్',
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
    placementCell: "ప్లేస్‌మెంట్ సెల్",
    // New Direction Keys
    turnLeftMain: "ప్రధాన ద్వారం నుండి ఎడమవైపు తిరగండి.",
    turnRightMain: "ప్రధాన ద్వారం నుండి కుడివైపు తిరగండి.",
    walkRooms: "{n} గదులు నడవండి.",
    roomLeft: "ఎడమవైపు {n}వ గది.",
    roomRight: "కుడివైపు {n}వ గది.",
    turnLeftStairs: "మెట్ల నుండి ఎడమవైపు తిరగండి.",
    turnRightStairs: "మెట్ల నుండి కుడివైపు తిరగండి.",
    topCorridor: "టాప్ కారిడార్‌లో ఉంది.",
    leftSide: "ఎడమ వైపు.",
    rightSide: "కుడి వైపు.",
    walkStraight: "నేరుగా నడవండి.",
    nearStairs: "మెట్ల దగ్గర ఉంది.",
    endOfCorridor: "కారిడార్ చివరలో.",
    oppWashroom: "వాష్‌రూమ్‌కు ఎదురుగా.",
    adjLibrary: "లైబ్రరీ పక్కన.",
    bottomCorridor: "బాటమ్ కారిడార్‌లో ఉంది."
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
    fourthFloor: 'चौथी मंजिल',
    basement: 'बेसमेंट',
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
    placementCell: "प्लेसमेंट सेल",
    // New Direction Keys
    turnLeftMain: "मुख्य द्वार से बाएं मुड़ें।",
    turnRightMain: "मुख्य द्वार से दाएं मुड़ें।",
    walkRooms: "{n} कमरे चलें।",
    roomLeft: "बाईं ओर {n} कमरा।",
    roomRight: "दाईं ओर {n} कमरा।",
    turnLeftStairs: "सीढ़ियों से बाएं मुड़ें।",
    turnRightStairs: "सीढ़ियों से दाएं मुड़ें।",
    topCorridor: "टॉप कॉरिडोर में स्थित है।",
    leftSide: "बाईं तरफ।",
    rightSide: "दाईं तरफ।",
    walkStraight: "सीधे चलें।",
    nearStairs: "सीढ़ियों के पास स्थित है।",
    endOfCorridor: "गलियारे के अंत में।",
    oppWashroom: "वॉशरूम के सामने।",
    adjLibrary: "लाइब्रेरी के बगल में।",
    bottomCorridor: "बॉटम कॉरिडोर में स्थित है।"
  }
};

// =====================================================================
// DYNAMIC LOCATION GENERATOR
// =====================================================================

export const getLocations = (lang: Language = 'en'): LocationData[] => {
  const d = DICTIONARY[lang];
  const floorName = (key: string) => d[key as keyof typeof d] || key;

  // Helper for localized strings with parameters
  const t = (key: keyof typeof d, params?: Record<string, string | number>) => {
    let str = d[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  // Helper to create a location object
  const createLoc = (
    id: string,
    name: string,
    floorKey: string,
    category: LocationData['category'],
    steps: { instruction: string; icon: any }[],
    aliases: string[] = [],
    dept?: string,
    prog?: string
  ): LocationData => ({
    id,
    name,
    block: d.mainBlock,
    floor: floorName(floorKey),
    category,
    steps,
    aliases,
    department: dept,
    program: prog,
    distance: steps.length * 10, // Approximate distance based on steps
    estimatedTime: Math.ceil(steps.length * 0.5), // Approximate time
  });

  const startInstruction = { instruction: d.start, icon: 'straight' as const };
  
  // Common navigation segments
  const toBasement = { instruction: `${d.goTo} ${d.basement}.`, icon: 'stairs-down' as const };
  const toFirstFloor = { instruction: `${d.goTo} ${d.firstFloor}.`, icon: 'stairs-up' as const };
  const toSecondFloor = { instruction: `${d.goTo} ${d.secondFloor}.`, icon: 'stairs-up' as const };
  const toThirdFloor = { instruction: `${d.goTo} ${d.thirdFloor}.`, icon: 'stairs-up' as const };
  const toFourthFloor = { instruction: `${d.goTo} ${d.fourthFloor}.`, icon: 'stairs-up' as const };

  return [
    // --- EXTERNAL BLOCKS (UNCHANGED) ---
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
        { instruction: d.exitRight.replace('Exit Main Block and ', ''), icon: 'turn-right' },
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

    // =================================================================
    // MAIN BLOCK - GROUND FLOOR
    // =================================================================
    
    // --- LEFT SIDE (Ground Floor) ---
    createLoc('g16-hod', 'G16 - HOD & Dean Cabin', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['dean', 'hod cabin', 'g16']),

    createLoc('g17-mech', 'G17 - Mech Class Room', 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['mech class', 'g17'], 'MECH', 'B.Tech'),

    createLoc('g18-mech', 'G18 - Mech Class Room', 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['mech class', 'g18'], 'MECH', 'B.Tech'),

    createLoc('g19-mech', 'G19 - Mech Class Room', 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['mech class', 'g19'], 'MECH', 'B.Tech'),

    createLoc('g20-mech', 'G20 - Mech Class Room', 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['mech class', 'g20'], 'MECH', 'B.Tech'),

    // --- TOP LEFT (Ground Floor) ---
    createLoc('g15-civil', 'G15 - Civil Class Room', 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['civil class', 'g15'], 'CIVIL', 'B.Tech'),

    createLoc('g14-civil', 'G14 - Civil Class Room', 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['civil class', 'g14'], 'CIVIL', 'B.Tech'),

    createLoc('g13-civil', 'G13 - Civil Class Room', 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['civil class', 'g13'], 'CIVIL', 'B.Tech'),

    createLoc('g12-staff', 'G12 - Staff Room', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['faculty room', 'g12']),

    // --- RIGHT SIDE (Ground Floor) ---
    createLoc('g08-iqac', 'G08 - IQAC Cell', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['iqac', 'quality cell', 'g08']),

    createLoc('g09-exam', 'G09 - Exam Cell', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['exam section', 'results', 'g09']),

    createLoc('g10-board', 'G10 - Board Room', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['conference room', 'board room', 'g10']),

    createLoc('g11-fee', 'G11 - Fee Payment Section', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['fees', 'accounts', 'payment', 'g11']),

    // --- TOP RIGHT (Ground Floor) ---
    createLoc('g07-canteen', 'G07 - Canteen', 'groundFloor', 'amenity', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['cafeteria', 'food', 'g07']),

    createLoc('g06-seminar', 'G06 - Seminar Hall', 'groundFloor', 'amenity', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['auditorium', 'hall', 'g06']),

    createLoc('g05-principal-office', 'G05/G04 - Principal Office', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['office', 'admin', 'g05', 'g04']),

    createLoc('g03-principal-cabin', 'G03 - Principal Cabin', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['principal', 'g03']),

    createLoc('g02-pantry', 'G02 - Pantry', 'groundFloor', 'amenity', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['kitchen', 'g02']),

    createLoc('g01-chairman', 'G01 - Chairman Cabin', 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['chairman', 'g01']),

    // =================================================================
    // MAIN BLOCK - BASEMENT
    // =================================================================
    // --- RIGHT SIDE (Bottom Row) ---
    createLoc('b1-placement', 'B1 - Placement Cell (C14)', 'basement', 'administrative', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['placement', 'jobs', 'c14']),

    createLoc('b2-it-lab', 'B2 - IT Lab / All Drive Exam Cell (C07)', 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['it lab', 'exam drive', 'c07']),

    createLoc('b3-watchman', 'B3 - Watchman Room (C08)', 'basement', 'administrative', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['security', 'c08']),

    createLoc('b4-cse-lab', 'B4 - CSE Computer Lab (C09)', 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['computer lab', 'cse lab', 'c09'], 'CSE', 'B.Tech'),

    createLoc('b4-c10', 'C10', 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['c10'], 'CSE', 'B.Tech'),

    // --- LEFT SIDE (Top Row) ---
    createLoc('b6-boys-wash', 'B6 - Boys Wash Room (C05)', 'basement', 'amenity', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['boys washroom', 'c05']),

    createLoc('b7-ladies-staff-wash', 'B7 - Ladies Staff Wash Room (C04)', 'basement', 'amenity', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['ladies staff washroom', 'c04']),

    createLoc('b8-boys-staff-wash', 'B8 - Boys Staff Wash Room (C03)', 'basement', 'amenity', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['boys staff washroom', 'c03']),

    createLoc('b5-bee-lab', 'B5 - BEE Lab (C01)', 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['bee lab', 'c01'], 'EEE', 'B.Tech'),

    // =================================================================
    // MAIN BLOCK - 1ST FLOOR
    // =================================================================
    
    // --- LEFT SIDE (Top Row - 1st Floor) ---
    createLoc('111-ladies-wash', '111 - Ladies Wash Room', 'firstFloor', 'amenity', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['ladies washroom', '111']),

    createLoc('110-ds', '110 - Data Science', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['data science', '110'], 'CSE', 'B.Tech'),

    createLoc('109-aiml', '109 - AIML', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['aiml', '109'], 'CSE', 'B.Tech'),

    createLoc('108-cse-3b', '108 - CSE 3rd Year B', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['cse 3rd year b', '108'], 'CSE', 'B.Tech'),

    createLoc('107-nss', '107 - NSS Unit', 'firstFloor', 'administrative', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['nss', '107']),

    createLoc('102-library-sec', '102 - Library Section', 'firstFloor', 'amenity', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['library', '102']),

    createLoc('101-library', '101 - Library', 'firstFloor', 'amenity', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 7 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 7 }), icon: 'destination' }
    ], ['books', 'reading room', '101']),

    // --- RIGHT SIDE (Bottom Row - 1st Floor) ---
    createLoc('112-hod', '112 - HOD Cabin', 'firstFloor', 'administrative', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['hod', '112']),

    createLoc('113-staff', '113 - Staff Room', 'firstFloor', 'administrative', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['faculty', '113']),

    createLoc('114-cse-2', '114 - CSE 2nd Year', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['cse 2nd year', '114'], 'CSE', 'B.Tech'),

    createLoc('115-cyber', '115 - Cyber Security 3rd Year', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['cyber security', '115'], 'CSE', 'B.Tech'),

    createLoc('116-3rd-a', '116 - 3rd Year A', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['3rd year a', '116'], 'CSE', 'B.Tech'),

    createLoc('103-cse-sim', '103-105 - CSE Simulation Lab', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 6 }), icon: 'destination' }
    ], ['simulation lab', '103', '104', '105'], 'CSE', 'B.Tech'),

    createLoc('106-ece-comm', '106 - ECE Communication Lab', 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 7 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 7 }), icon: 'destination' }
    ], ['comm lab', '106'], 'ECE', 'B.Tech'),

    // =================================================================
    // MAIN BLOCK - 2ND FLOOR
    // =================================================================
    // --- RIGHT SIDE (Bottom Row - 2nd Floor) ---
    createLoc('216-staff', '216 - Staff Room', 'secondFloor', 'administrative', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['staff', '216']),

    createLoc('218-rnd', '218 - Research & Development', 'secondFloor', 'administrative', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['r&d', 'research', '218']),

    createLoc('219-cse-2b', '219 - CSE 2nd Year B', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['cse 2nd year b', '219'], 'CSE', 'B.Tech'),

    createLoc('220-cse-2c', '220 - CSE 2nd Year C', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['cse 2nd year c', '220'], 'CSE', 'B.Tech'),

    createLoc('221-cse', '221 - CSE', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['cse', '221'], 'CSE', 'B.Tech'),

    createLoc('207-eee-lab', '207 - EEE Lab', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 6 }), icon: 'destination' }
    ], ['eee lab', '207'], 'EEE', 'B.Tech'),

    createLoc('208-chem-lab', '208 - Chemistry Lab', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 7 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 7 }), icon: 'destination' }
    ], ['chemistry lab', '208'], 'EEE', 'B.Tech'),

    createLoc('209-phy-lab', '209 - Physics Lab', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 8 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 8 }), icon: 'destination' }
    ], ['physics lab', '209'], 'EEE', 'B.Tech'),

    createLoc('210-control-lab', '210 - Control System Lab', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 9 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 9 }), icon: 'destination' }
    ], ['control system lab', '210'], 'EEE', 'B.Tech'),

    createLoc('211-ladies-wash-2', '211 - Ladies Wash Room', 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 10 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 10 }), icon: 'destination' }
    ], ['ladies washroom', '211']),

    // --- LEFT SIDE (Top Row - 2nd Floor) ---
    createLoc('217-boys-wash-2b', '217 - Boys Wash Room', 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['boys washroom', '217']),

    createLoc('215-cse-2a', '215 - CSE 2nd A', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['cse 2nd a', '215'], 'CSE', 'B.Tech'),

    createLoc('214-ds-2', '214 - Data Science', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['data science', '214'], 'CSE', 'B.Tech'),

    createLoc('213-cyber-2', '213 - Cyber Security', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['cyber security', '213'], 'CSE', 'B.Tech'),

    createLoc('212-ladies-wash-2b', '212 - Ladies Wash Room', 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['ladies washroom', '212']),

    createLoc('206-boys-wash-2', '206 - Boys Wash Room', 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['boys washroom', '206']),

    createLoc('205-eee-hod', '205 - EEE HOD', 'secondFloor', 'administrative', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 7 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 7 }), icon: 'destination' }
    ], ['eee hod', '205'], 'EEE', 'B.Tech'),

    createLoc('204-eee-2a', '204 - EEE 2nd A', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 8 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 8 }), icon: 'destination' }
    ], ['eee 2nd a', '204'], 'EEE', 'B.Tech'),

    createLoc('203-eee-2b', '203 - EEE 2nd B', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 9 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 9 }), icon: 'destination' }
    ], ['eee 2nd b', '203'], 'EEE', 'B.Tech'),

    createLoc('202-eee-3a', '202 - EEE 3rd A', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 10 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 10 }), icon: 'destination' }
    ], ['eee 3rd a', '202'], 'EEE', 'B.Tech'),

    createLoc('201-eee-3b', '201 - EEE 3rd B', 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 11 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 11 }), icon: 'destination' }
    ], ['eee 3rd b', '201'], 'EEE', 'B.Tech'),

    // =================================================================
    // MAIN BLOCK - 3RD FLOOR (ECE)
    // =================================================================
    // --- LEFT SIDE (Top Row - 3rd Floor) ---
    createLoc('306-boys-wash-3', '306 - Boys Wash Room', 'thirdFloor', 'amenity', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['boys washroom', '306']),

    createLoc('305-ece-hod', '305 - ECE HOD Cabin', 'thirdFloor', 'administrative', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['ece hod', '305'], 'ECE', 'B.Tech'),

    createLoc('304-ece-2b', '304 - ECE 2nd B', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['ece 2nd b', '304'], 'ECE', 'B.Tech'),

    createLoc('303-ece-2a', '303 - ECE 2nd A', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['ece 2nd a', '303'], 'ECE', 'B.Tech'),

    createLoc('302-ece-3a', '302 - ECE 3rd A', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['ece 3rd a', '302'], 'ECE', 'B.Tech'),

    createLoc('301-ece-3b', '301 - ECE 3rd B', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['ece 3rd b', '301'], 'ECE', 'B.Tech'),

    // --- RIGHT SIDE (Bottom Row - 3rd Floor) ---
    createLoc('307-ece-power', '307 - ECE Power Electronics Lab', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['power electronics', '307'], 'ECE', 'B.Tech'),

    createLoc('308-ece-acdc', '308 - ECE AC & DC Lab', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['ac dc lab', '308'], 'ECE', 'B.Tech'),

    createLoc('309-ece-aica', '309 - ECE AICA & DICD Lab', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['aica lab', '309'], 'ECE', 'B.Tech'),

    createLoc('310-ece-workshop', '310 - ECE Electronics Workshop', 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['workshop', '310'], 'ECE', 'B.Tech'),

    createLoc('311-ladies-wash-3', '311 - Ladies Wash Room', 'thirdFloor', 'amenity', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['ladies washroom', '311']),

    // =================================================================
    // MAIN BLOCK - 4TH FLOOR
    // =================================================================
    createLoc('401-hostel-wash', 'Hostel Wash Room', 'fourthFloor', 'amenity', [
      startInstruction,
      toFourthFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['hostel washroom']),

    createLoc('402-cloth-wash', 'Cloth Washing Area', 'fourthFloor', 'amenity', [
      startInstruction,
      toFourthFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['washing area', 'laundry']),
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
