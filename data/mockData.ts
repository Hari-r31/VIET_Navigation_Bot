
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
    bottomCorridor: "Located in Bottom Corridor.",
    // Location Names
    mech: 'Mechanical',
    civil: 'Civil',
    cse: 'CSE',
    ece: 'ECE',
    eee: 'EEE',
    lab: 'Lab',
    workshop: 'Workshop',
    seminarHall: 'Seminar Hall',
    boardRoom: 'Board Room',
    pantry: 'Pantry',
    chairmanCabin: 'Chairman Cabin',
    principalCabin: 'Principal Cabin',
    iqac: 'IQAC Cell',
    nss: 'NSS Unit',
    library: 'Library',
    librarySection: 'Library Section',
    girlsWaitingRoom: 'Girls Waiting Room',
    staffWashroom: 'Staff Washroom',
    ladiesStaffWashroom: 'Ladies Staff Washroom',
    boysStaffWashroom: 'Boys Staff Washroom',
    hostelWashroom: 'Hostel Washroom',
    washingArea: 'Washing Area',
    rnd: 'Research & Development',
    cyberSecurity: 'Cyber Security',
    dataScience: 'Data Science',
    aiml: 'AIML',
    year: 'Year',
    classRoom: 'Class Room',
    collegeGround: 'College Ground',
    canteen: 'Canteen',
    mess: 'Mess',
    studentMess: 'Student Mess',
    security: 'Security',
    watchman: 'Watchman Room',
    itLab: 'IT Lab',
    examDrive: 'All Drive Exam Cell',
    powerElec: 'Power Electronics',
    acdc: 'AC & DC',
    aica: 'AICA & DICD',
    controlSys: 'Control System',
    chemistry: 'Chemistry',
    physics: 'Physics',
    bee: 'BEE',
    comm: 'Communication',
    simulation: 'Simulation',
    feeSection: 'Fee Payment Section',
    dean: 'Dean'
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
    bottomCorridor: "బాటమ్ కారిడార్‌లో ఉంది.",
    // Location Names
    mech: 'మెకానికల్',
    civil: 'సివిల్',
    cse: 'CSE',
    ece: 'ECE',
    eee: 'EEE',
    lab: 'ల్యాబ్',
    workshop: 'వర్క్‌షాప్',
    seminarHall: 'సెమినార్ హాల్',
    boardRoom: 'బోర్డ్ రూమ్',
    pantry: 'పాంట్రీ',
    chairmanCabin: 'చైర్మన్ క్యాబిన్',
    principalCabin: 'ప్రిన్సిపాల్ క్యాబిన్',
    iqac: 'IQAC సెల్',
    nss: 'NSS యూనిట్',
    library: 'లైబ్రరీ',
    librarySection: 'లైబ్రరీ విభాగం',
    girlsWaitingRoom: 'బాలికల వెయిటింగ్ రూమ్',
    staffWashroom: 'స్టాఫ్ వాష్‌రూమ్',
    ladiesStaffWashroom: 'లేడీస్ స్టాఫ్ వాష్‌రూమ్',
    boysStaffWashroom: 'బాయ్స్ స్టాఫ్ వాష్‌రూమ్',
    hostelWashroom: 'హాస్టల్ వాష్‌రూమ్',
    washingArea: 'వాషింగ్ ఏరియా',
    rnd: 'R&D',
    cyberSecurity: 'సైబర్ సెక్యూరిటీ',
    dataScience: 'డేటా సైన్స్',
    aiml: 'AIML',
    year: 'సంవత్సరం',
    classRoom: 'తరగతి గది',
    collegeGround: 'కాలేజ్ గ్రౌండ్',
    canteen: 'క్యాంటీన్',
    mess: 'మెస్',
    studentMess: 'విద్యార్థుల మెస్',
    security: 'సెక్యూరిటీ',
    watchman: 'వాచ్‌మెన్ రూమ్',
    itLab: 'IT ల్యాబ్',
    examDrive: 'ఆల్ డ్రైవ్ ఎగ్జామ్ సెల్',
    powerElec: 'పవర్ ఎలక్ట్రానిక్స్',
    acdc: 'AC & DC',
    aica: 'AICA & DICD',
    controlSys: 'కంట్రోల్ సిస్టమ్',
    chemistry: 'కెమిస్ట్రీ',
    physics: 'ఫిజిక్స్',
    bee: 'BEE',
    comm: 'కమ్యూనికేషన్',
    simulation: 'సిమ్యులేషన్',
    feeSection: 'ఫీజు చెల్లింపు విభాగం',
    dean: 'డీన్'
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
    bottomCorridor: "बॉटम कॉरिडोर में स्थित है।",
    // Location Names
    mech: 'मैकेनिकल',
    civil: 'सिविल',
    cse: 'CSE',
    ece: 'ECE',
    eee: 'EEE',
    lab: 'लैब',
    workshop: 'वर्कशॉप',
    seminarHall: 'सेमिनार हॉल',
    boardRoom: 'बोर्ड रूम',
    pantry: 'पैंट्री',
    chairmanCabin: 'चेयरमैन केबिन',
    principalCabin: 'प्रिंसिपल केबिन',
    iqac: 'IQAC सेल',
    nss: 'NSS यूनिट',
    library: 'लाइब्रेरी',
    librarySection: 'लाइब्रेरी अनुभाग',
    girlsWaitingRoom: 'गर्ल्स वेटिंग रूम',
    staffWashroom: 'स्टाफ वॉशरूम',
    ladiesStaffWashroom: 'लेडीज स्टाफ वॉशरूम',
    boysStaffWashroom: 'बॉयज स्टाफ वॉशरूम',
    hostelWashroom: 'हॉस्टल वॉशरूम',
    washingArea: 'वाशिंग एरिया',
    rnd: 'R&D',
    cyberSecurity: 'साइबर सिक्योरिटी',
    dataScience: 'डेटा साइंस',
    aiml: 'AIML',
    year: 'वर्ष',
    classRoom: 'क्लासरूम',
    collegeGround: 'कॉलेज ग्राउंड',
    canteen: 'कैंटीन',
    mess: 'मेस',
    studentMess: 'छात्र मेस',
    security: 'सुरक्षा',
    watchman: 'चौकीदार कक्ष',
    itLab: 'IT लैब',
    examDrive: 'ऑल ड्राइव परीक्षा कक्ष',
    powerElec: 'पावर इलेक्ट्रॉनिक्स',
    acdc: 'AC & DC',
    aica: 'AICA & DICD',
    controlSys: 'कंट्रोल सिस्टम',
    chemistry: 'रसायन विज्ञान',
    physics: 'भौतिकी',
    bee: 'BEE',
    comm: 'कम्युनिकेशन',
    simulation: 'सिमुलेशन',
    feeSection: 'शुल्क भुगतान अनुभाग',
    dean: 'डीन'
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
    prog?: LocationData['program'],
    customImage?: string
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
    // Placeholder image for now. 
    // TODO: In the future, to use local images, replace the line below with:
    // mapImage: `/images/rooms/${id}.jpg`,
    mapImage: customImage || `/images/rooms/${id}.jpg`,
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
      aliases: ['mba', 'management block', 'business school', 'business', 'management'],
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
      aliases: ['polytechnic', 'diploma', 'poly'],
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
      name: d.collegeGround,
      block: d.campusFacilities,
      floor: d.openArea,
      category: 'amenity',
      aliases: ['playground', 'cricket', 'sports', 'play ground'],
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
      name: d.canteen,
      block: d.campusFacilities,
      floor: d.groundFloor,
      category: 'amenity',
      aliases: ['food', 'lunch', 'cafeteria', 'cafe', 'snacks'],
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
      name: d.studentMess,
      block: d.campusFacilities,
      floor: d.groundFloor,
      category: 'amenity',
      aliases: ['hostel mess', 'dining', 'food'],
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
    createLoc('g16-hod', `G16 - ${d.hodCabin} & ${d.dean}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['dean', 'hod cabin', 'g16', 'dean office', 'head of department']),

    createLoc('g17-mech', `G17 - ${d.mech} ${d.classRoom}`, 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['mech class', 'g17', 'mechanical classroom', 'me classroom'], 'MECH', 'B.Tech'),

    createLoc('g18-mech', `G18 - ${d.mech} ${d.classRoom}`, 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['mech class', 'g18', 'mechanical classroom', 'me classroom'], 'MECH', 'B.Tech'),

    createLoc('g19-mech', `G19 - ${d.mech} ${d.classRoom}`, 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['mech class', 'g19', 'mechanical classroom', 'me classroom'], 'MECH', 'B.Tech'),

    createLoc('g20-mech', `G20 - ${d.mech} ${d.classRoom}`, 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['mech class', 'g20', 'mechanical classroom', 'me classroom'], 'MECH', 'B.Tech'),

    // --- TOP LEFT (Ground Floor) ---
    createLoc('g15-civil', `G15 - ${d.civil} ${d.classRoom}`, 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['civil class', 'g15', 'civil classroom', 'ce classroom'], 'CIVIL', 'B.Tech'),

    createLoc('g14-civil', `G14 - ${d.civil} ${d.classRoom}`, 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['civil class', 'g14', 'civil classroom', 'ce classroom'], 'CIVIL', 'B.Tech'),

    createLoc('g13-civil', `G13 - ${d.civil} ${d.classRoom}`, 'groundFloor', 'academic', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['civil class', 'g13', 'civil classroom', 'ce classroom'], 'CIVIL', 'B.Tech'),

    createLoc('g12-staff', `G12 - ${d.staffRoom}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnLeftMain, icon: 'turn-left' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['faculty room', 'g12', 'staff room']),

    // --- RIGHT SIDE (Ground Floor) ---
    createLoc('g08-iqac', `G08 - ${d.iqac}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['iqac', 'quality cell', 'g08', 'internal quality assurance cell']),

    createLoc('g09-exam', `G09 - ${d.examCell}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['exam section', 'results', 'g09', 'examination branch', 'exam cell']),

    createLoc('g10-board', `G10 - ${d.boardRoom}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['conference room', 'board room', 'g10', 'meeting room', 'conference hall']),

    createLoc('g11-fee', `G11 - ${d.feeSection}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['fees', 'accounts', 'payment', 'g11', 'cashier']),

    // --- TOP RIGHT (Ground Floor) ---
    createLoc('g07-canteen', `G07 - ${d.canteen}`, 'groundFloor', 'amenity', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['cafeteria', 'food', 'g07', 'snacks', 'cafe']),

    createLoc('g06-seminar', `G06 - ${d.seminarHall}`, 'groundFloor', 'amenity', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['auditorium', 'hall', 'g06', 'event hall', 'seminar']),

    createLoc('g05-principal-office', `G05/G04 - ${d.principalOffice}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['office', 'admin', 'g05', 'g04', 'admin office', 'enquiry']),

    createLoc('g03-principal-cabin', `G03 - ${d.principalCabin}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['principal', 'g03', 'principal room', 'head of institute']),

    createLoc('g02-pantry', `G02 - ${d.pantry}`, 'groundFloor', 'amenity', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['kitchen', 'g02', 'pantry']),

    createLoc('g01-chairman', `G01 - ${d.chairmanCabin}`, 'groundFloor', 'administrative', [
      startInstruction,
      { instruction: d.turnRightMain, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['chairman', 'g01', 'chairman room']),

    // =================================================================
    // MAIN BLOCK - BASEMENT
    // =================================================================
    // --- RIGHT SIDE (Bottom Row) ---
    createLoc('b1-placement', `B1 - ${d.placementCell} (C14)`, 'basement', 'administrative', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['placement', 'jobs', 'c14', 'placement cell', 'career']),

    createLoc('b2-it-lab', `B2 - ${d.itLab} / ${d.examDrive} (C07)`, 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['it lab', 'exam drive', 'c07', 'information technology lab']),

    createLoc('b3-watchman', `B3 - ${d.watchman} (C08)`, 'basement', 'administrative', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['security', 'c08', 'watchman room', 'guard']),

    createLoc('b4-cse-lab', `B4 - ${d.cse} ${d.lab} (C09)`, 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['computer lab', 'cse lab', 'c09', 'computer science lab'], 'CSE', 'B.Tech'),

    createLoc('b4-c10', 'C10', 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['c10', 'computer lab'], 'CSE', 'B.Tech'),

    // --- LEFT SIDE (Top Row) ---
    createLoc('b6-boys-wash', `B6 - ${d.washroomBoys} (C05)`, 'basement', 'amenity', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['boys washroom', 'c05', 'gents toilet']),

    createLoc('b7-ladies-staff-wash', `B7 - ${d.ladiesStaffWashroom} (C04)`, 'basement', 'amenity', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['ladies staff washroom', 'c04', 'female staff toilet']),

    createLoc('b8-boys-staff-wash', `B8 - ${d.boysStaffWashroom} (C03)`, 'basement', 'amenity', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['boys staff washroom', 'c03', 'male staff toilet']),

    createLoc('b5-bee-lab', `B5 - ${d.bee} ${d.lab} (C01)`, 'basement', 'academic', [
      startInstruction,
      toBasement,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['bee lab', 'c01', 'basic electrical engineering lab'], 'EEE', 'B.Tech'),

    // =================================================================
    // MAIN BLOCK - 1ST FLOOR
    // =================================================================
    
    // --- LEFT SIDE (Top Row - 1st Floor) ---
    createLoc('111-ladies-wash', `111 - ${d.washroomGirls}`, 'firstFloor', 'amenity', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['ladies washroom', '111', 'girls toilet', 'female washroom']),

    createLoc('110-ds', `110 - ${d.dataScience}`, 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['data science', '110', 'ds lab', 'ds classroom'], 'CSE', 'B.Tech'),

    createLoc('109-aiml', `109 - ${d.aiml}`, 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['aiml', '109', 'ai lab', 'ai classroom'], 'CSE', 'B.Tech'),

    createLoc('108-cse-3b', `108 - ${d.cse} 3rd ${d.year} B`, 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['cse 3rd year b', '108', 'cse 3b'], 'CSE', 'B.Tech'),

    createLoc('107-nss', `107 - ${d.nss}`, 'firstFloor', 'administrative', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['nss', '107', 'national service scheme']),

    createLoc('102-library-sec', `102 - ${d.librarySection}`, 'firstFloor', 'amenity', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['library', '102', 'library section']),

    createLoc('101-library', `101 - ${d.library}`, 'firstFloor', 'amenity', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 7 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 7 }), icon: 'destination' }
    ], ['books', 'reading room', '101', 'library']),

    // --- RIGHT SIDE (Bottom Row - 1st Floor) ---
    createLoc('112-hod', `112 - ${d.hodCabin}`, 'firstFloor', 'administrative', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['hod', '112', 'head of department']),

    createLoc('113-staff', `113 - ${d.staffRoom}`, 'firstFloor', 'administrative', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['faculty', '113', 'staff room']),

    createLoc('114-cse-2', `114 - ${d.cse} 2nd ${d.year}`, 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['cse 2nd year', '114'], 'CSE', 'B.Tech'),

    createLoc('115-cyber', `115 - ${d.cyberSecurity} 3rd ${d.year}`, 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['cyber security', '115'], 'CSE', 'B.Tech'),

    createLoc('116-3rd-a', `116 - 3rd ${d.year} A`, 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['3rd year a', '116'], 'CSE', 'B.Tech'),

    createLoc('103-cse-sim', `103-105 - ${d.cse} ${d.simulation} ${d.lab}`, 'firstFloor', 'academic', [
      startInstruction,
      toFirstFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 6 }), icon: 'destination' }
    ], ['simulation lab', '103', '104', '105'], 'CSE', 'B.Tech'),

    createLoc('106-ece-comm', `106 - ${d.ece} ${d.comm} ${d.lab}`, 'firstFloor', 'academic', [
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
    createLoc('216-staff', `216 - ${d.staffRoom}`, 'secondFloor', 'administrative', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['staff', '216', 'faculty room', 'staff room']),

    createLoc('218-rnd', `218 - ${d.rnd}`, 'secondFloor', 'administrative', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['r&d', 'research', '218', 'research and development']),

    createLoc('219-cse-2b', `219 - ${d.cse} 2nd ${d.year} B`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['cse 2nd year b', '219', 'cse 2b'], 'CSE', 'B.Tech'),

    createLoc('220-cse-2c', `220 - ${d.cse} 2nd ${d.year} C`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['cse 2nd year c', '220', 'cse 2c'], 'CSE', 'B.Tech'),

    createLoc('221-cse', `221 - ${d.cse}`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['cse', '221', 'computer science'], 'CSE', 'B.Tech'),

    createLoc('207-eee-lab', `207 - ${d.eee} ${d.lab}`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 6 }), icon: 'destination' }
    ], ['eee lab', '207', 'electrical lab'], 'EEE', 'B.Tech'),

    createLoc('208-chem-lab', `208 - ${d.chemistry} ${d.lab}`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 7 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 7 }), icon: 'destination' }
    ], ['chemistry lab', '208', 'chem lab'], 'EEE', 'B.Tech'),

    createLoc('209-phy-lab', `209 - ${d.physics} ${d.lab}`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 8 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 8 }), icon: 'destination' }
    ], ['physics lab', '209', 'phy lab'], 'EEE', 'B.Tech'),

    createLoc('210-control-lab', `210 - ${d.controlSys} ${d.lab}`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 9 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 9 }), icon: 'destination' }
    ], ['control system lab', '210', 'control lab'], 'EEE', 'B.Tech'),

    createLoc('211-ladies-wash-2', `211 - ${d.washroomGirls}`, 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 10 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 10 }), icon: 'destination' }
    ], ['ladies washroom', '211', 'girls toilet']),

    // --- LEFT SIDE (Top Row - 2nd Floor) ---
    createLoc('217-boys-wash-2b', `217 - ${d.washroomBoys}`, 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['boys washroom', '217', 'gents toilet']),

    createLoc('215-cse-2a', `215 - ${d.cse} 2nd A`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['cse 2nd a', '215', 'cse 2a'], 'CSE', 'B.Tech'),

    createLoc('214-ds-2', `214 - ${d.dataScience}`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['data science', '214', 'ds classroom'], 'CSE', 'B.Tech'),

    createLoc('213-cyber-2', `213 - ${d.cyberSecurity}`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['cyber security', '213', 'cyber classroom'], 'CSE', 'B.Tech'),

    createLoc('212-ladies-wash-2b', `212 - ${d.washroomGirls}`, 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['ladies washroom', '212', 'girls toilet']),

    createLoc('206-boys-wash-2', `206 - ${d.washroomBoys}`, 'secondFloor', 'amenity', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['boys washroom', '206', 'gents toilet']),

    createLoc('205-eee-hod', `205 - ${d.eee} ${d.hodCabin}`, 'secondFloor', 'administrative', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 7 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 7 }), icon: 'destination' }
    ], ['eee hod', '205', 'head of department eee'], 'EEE', 'B.Tech'),

    createLoc('204-eee-2a', `204 - ${d.eee} 2nd A`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 8 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 8 }), icon: 'destination' }
    ], ['eee 2nd a', '204', 'eee 2a'], 'EEE', 'B.Tech'),

    createLoc('203-eee-2b', `203 - ${d.eee} 2nd B`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 9 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 9 }), icon: 'destination' }
    ], ['eee 2nd b', '203', 'eee 2b'], 'EEE', 'B.Tech'),

    createLoc('202-eee-3a', `202 - ${d.eee} 3rd A`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 10 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 10 }), icon: 'destination' }
    ], ['eee 3rd a', '202', 'eee 3a'], 'EEE', 'B.Tech'),

    createLoc('201-eee-3b', `201 - ${d.eee} 3rd B`, 'secondFloor', 'academic', [
      startInstruction,
      toSecondFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 11 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 11 }), icon: 'destination' }
    ], ['eee 3rd b', '201', 'eee 3b'], 'EEE', 'B.Tech'),

    // =================================================================
    // MAIN BLOCK - 3RD FLOOR (ECE)
    // =================================================================
    // --- LEFT SIDE (Top Row - 3rd Floor) ---
    createLoc('306-boys-wash-3', `306 - ${d.washroomBoys}`, 'thirdFloor', 'amenity', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['boys washroom', '306', 'gents toilet']),

    createLoc('305-ece-hod', `305 - ${d.ece} ${d.hodCabin}`, 'thirdFloor', 'administrative', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 2 }), icon: 'destination' }
    ], ['ece hod', '305', 'head of department ece'], 'ECE', 'B.Tech'),

    createLoc('304-ece-2b', `304 - ${d.ece} 2nd B`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 3 }), icon: 'destination' }
    ], ['ece 2nd b', '304', 'ece 2b'], 'ECE', 'B.Tech'),

    createLoc('303-ece-2a', `303 - ${d.ece} 2nd A`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 4 }), icon: 'destination' }
    ], ['ece 2nd a', '303', 'ece 2a'], 'ECE', 'B.Tech'),

    createLoc('302-ece-3a', `302 - ${d.ece} 3rd A`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 5 }), icon: 'destination' }
    ], ['ece 3rd a', '302', 'ece 3a'], 'ECE', 'B.Tech'),

    createLoc('301-ece-3b', `301 - ${d.ece} 3rd B`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 6 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 6 }), icon: 'destination' }
    ], ['ece 3rd b', '301', 'ece 3b'], 'ECE', 'B.Tech'),

    // --- RIGHT SIDE (Bottom Row - 3rd Floor) ---
    createLoc('307-ece-power', `307 - ${d.ece} ${d.powerElec} ${d.lab}`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['power electronics', '307', 'pe lab'], 'ECE', 'B.Tech'),

    createLoc('308-ece-acdc', `308 - ${d.ece} ${d.acdc} ${d.lab}`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 2 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 2 }), icon: 'destination' }
    ], ['ac dc lab', '308', 'acdc lab'], 'ECE', 'B.Tech'),

    createLoc('309-ece-aica', `309 - ${d.ece} ${d.aica} ${d.lab}`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 3 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 3 }), icon: 'destination' }
    ], ['aica lab', '309'], 'ECE', 'B.Tech'),

    createLoc('310-ece-workshop', `310 - ${d.ece} Electronics ${d.workshop}`, 'thirdFloor', 'academic', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 4 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 4 }), icon: 'destination' }
    ], ['workshop', '310', 'electronics workshop'], 'ECE', 'B.Tech'),

    createLoc('311-ladies-wash-3', `311 - ${d.washroomGirls}`, 'thirdFloor', 'amenity', [
      startInstruction,
      toThirdFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 5 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 5 }), icon: 'destination' }
    ], ['ladies washroom', '311', 'girls toilet']),

    // =================================================================
    // MAIN BLOCK - 4TH FLOOR
    // =================================================================
    createLoc('401-hostel-wash', `${d.hostelWashroom}`, 'fourthFloor', 'amenity', [
      startInstruction,
      toFourthFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomLeft', { n: 1 }), icon: 'destination' }
    ], ['hostel washroom', 'washroom']),

    createLoc('402-cloth-wash', `${d.washingArea}`, 'fourthFloor', 'amenity', [
      startInstruction,
      toFourthFloor,
      { instruction: d.turnRightStairs, icon: 'turn-right' },
      { instruction: t('walkRooms', { n: 1 }), icon: 'straight' },
      { instruction: t('roomRight', { n: 1 }), icon: 'destination' }
    ], ['washing area', 'laundry', 'cloth wash']),
  ];
};

// Backwards compatibility for existing imports (Default to English)
export const LOCATIONS: LocationData[] = getLocations('en');

export const FEES: FeeStructure[] = [

  // ================================
  // B.TECH (AP EAPCET - 2025)
  // ================================
  { id: 'bt-civil', course: 'B.Tech', branch: 'CIVIL', seats: 60, annualFee: 43000, managementFee: 43000 },
  { id: 'bt-cse', course: 'B.Tech', branch: 'CSE', seats: 240, annualFee: 43000, managementFee: 100000 },
  { id: 'bt-cse-aiml', course: 'B.Tech', branch: 'CSE – AI & ML', seats: 60, annualFee: 43000, managementFee: 100000 },
  { id: 'bt-cse-cs', course: 'B.Tech', branch: 'CSE – CS', seats: 60, annualFee: 43000, managementFee: 100000 },
  { id: 'bt-cse-ds', course: 'B.Tech', branch: 'CSE – DATA SCIENCE', seats: 60, annualFee: 43000, managementFee: 100000 },
  { id: 'bt-ece', course: 'B.Tech', branch: 'ECE', seats: 180, annualFee: 43000, managementFee: 80000 },
  { id: 'bt-eee', course: 'B.Tech', branch: 'EEE', seats: 60, annualFee: 43000, managementFee: 43000 },
  { id: 'bt-mech', course: 'B.Tech', branch: 'MECHANICAL ENGINEERING', seats: 150, annualFee: 43000, managementFee: 43000 },

  // ================================
  // B.TECH LATERAL ENTRY (AP ECET - 2025)
  // ================================
  { id: 'btle-civil', course: 'B.Tech Lateral Entry', branch: 'CIVIL', seats: 61, annualFee: 43000, spotFee: 43000 },
  { id: 'btle-cse', course: 'B.Tech Lateral Entry', branch: 'CSE', seats: 112, annualFee: 43000, spotFee: 80000 },
  { id: 'btle-cse-aiml', course: 'B.Tech Lateral Entry', branch: 'CSE – AI & ML', seats: 17, annualFee: 43000, spotFee: 80000 },
  { id: 'btle-cse-cs', course: 'B.Tech Lateral Entry', branch: 'CSE – CS', seats: 32, annualFee: 43000, spotFee: 80000 },
  { id: 'btle-cse-ds', course: 'B.Tech Lateral Entry', branch: 'CSE – DATA SCIENCE', seats: 33, annualFee: 43000, spotFee: 80000 },
  { id: 'btle-ece', course: 'B.Tech Lateral Entry', branch: 'ECE', seats: 121, annualFee: 43000, spotFee: 70000 },
  { id: 'btle-eee', course: 'B.Tech Lateral Entry', branch: 'EEE', seats: 58, annualFee: 43000, spotFee: 43000 },
  { id: 'btle-mech', course: 'B.Tech Lateral Entry', branch: 'MECHANICAL ENGINEERING', seats: 154, annualFee: 43000, spotFee: 43000 },

  // ================================
  // M.TECH (PGECET - 2025)
  // ================================
  { id: 'mt-vlsi', course: 'M.Tech', branch: 'VLSI', seats: 18, annualFee: 50000, description: 'CQ/MQ Fee: 50,000' },
  { id: 'mt-cse', course: 'M.Tech', branch: 'CSE', seats: 18, annualFee: 75000, description: 'CQ/MQ Fee: 75,000' },
  { id: 'mt-pes', course: 'M.Tech', branch: 'POWER ELECTRONIC & SYSTEMS', seats: 18, annualFee: 50000, description: 'CQ/MQ Fee: 50,000' },
  { id: 'mt-struct', course: 'M.Tech', branch: 'STRUCTURAL ENGINEERING', seats: 36, annualFee: 50000, description: 'CQ/MQ Fee: 50,000' },
  { id: 'mt-cadcam', course: 'M.Tech', branch: 'CAD / CAM', seats: 18, annualFee: 50000, description: 'CQ/MQ Fee: 50,000' },
  { id: 'mt-thermal', course: 'M.Tech', branch: 'THERMAL ENGINEERING', seats: 18, annualFee: 50000, description: 'CQ/MQ Fee: 50,000' },

  // ================================
  // DIPLOMA (AP POLYCET)
  // ================================
  { id: 'dip-agri', course: 'Diploma', branch: 'AGRICULTURAL ENGINEERING', seats: 30, annualFee: 45000, spotFee: 45000 },
  { id: 'dip-civil', course: 'Diploma', branch: 'CIVIL ENGINEERING', seats: 60, annualFee: 25000, spotFee: 25000 },
  { id: 'dip-comp', course: 'Diploma', branch: 'COMPUTER ENGINEERING', seats: 240, annualFee: 30000, spotFee: 30000 },
  { id: 'dip-ece', course: 'Diploma', branch: 'ELECTRONIC AND COMMUNICATION ENGINEERING', seats: 120, annualFee: 30000, spotFee: 30000 },
  { id: 'dip-eee', course: 'Diploma', branch: 'ELECTRICAL AND ELECTRONIC ENGINEERING', seats: 60, annualFee: 25000, spotFee: 25000 },
  { id: 'dip-mech', course: 'Diploma', branch: 'MECHANICAL ENGINEERING', seats: 120, annualFee: 25000, spotFee: 25000 },

  // ================================
  // MANAGEMENT COURSES (AP ICET & OAMDC)
  // ================================
  { id: 'bba', course: 'BCA/BBA', branch: 'BBA PROGRAMME', seats: 60, annualFee: 25000, spotFee: 25000 },
  { id: 'bca', course: 'BCA/BBA', branch: 'BCA PROGRAMME', seats: 60, annualFee: 25000, spotFee: 25000 },
  
  { id: 'mba-hr', course: 'MBA', branch: 'MBA (HR, Fin & Mark)', seats: 180, annualFee: 35000, managementFee: 45000, description: '1st & 2nd Year Fee same' },
  { id: 'mca', course: 'MCA', branch: 'MCA', seats: 180, annualFee: 35000, managementFee: 50000, description: '1st & 2nd Year Fee same' },

];
