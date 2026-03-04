
import { IntentType, AgentContext, AgentResponse, LocationData, LocationCategory } from '../types';
import { searchLocations } from './searchService';
import { getLocations } from '../data/mockData';
import { FAQS } from '../data/faqData';

// --- Multilingual Response Templates ---
const RESPONSE_TEMPLATES = {
  en: {
    greeting: "Hello! 👋 I can help you find locations or check fee structures. Try asking 'Where is the library?' or 'Show B.Tech fees'.",
    clear: "Okay, let's start over. How can I help?",
    unknown: "I'm not sure I understand. Try asking for 'Fees' or 'Directions'.",
    nav_category_prompt: "Sure! Are you looking for Administrative offices 🏛️, Academic departments 🎓, or General amenities ☕?",
    nav_found: (name: string) => `Found it! Taking you to ${name}.`,
    nav_not_found: "I couldn't find that location. 😕 Try searching for a department (e.g., 'CSE'), 'Library', or 'Canteen'.",
    fee_missing_course: "Which course are you interested in? (B.Tech, MBA, Diploma)",
    fee_missing_branch: (course: string) => `For ${course}, which branch? (e.g., CSE, ECE)`,
    fee_opening: (c: string, b: string) => `Opening fee structure for ${c} - ${b}...`,
    clarify_admin: "Okay, Administrative Section. 🏛️\nAre you looking for the Principal's Chamber, Admin Office, Exam Cell, or NCC Room?",
    clarify_academic: "Got it, Academic Departments. 🎓\nWe have CSE, ECE, EEE, Mechanical, and Civil. Which one would you like to visit?",
    clarify_amenity: "General Amenities. ☕\nI can take you to the Central Library, Canteen, Seminar Hall, or Girls Waiting Room. What's your choice?",
    clarify_fail: "I didn't quite understand. Please choose: 'Administrative', 'Departments', or 'Amenities'.",
    disambiguate: (options: string) => `I found a few places. Did you mean ${options}?`,
    cancelled: "Okay, cancelled. What else can I help you find?",
    still_trouble: "I'm still having trouble. Try searching for the exact Department or Block name.",
    didnt_catch_course: "I didn't catch that. Please say B.Tech, MBA, or Diploma.",
    didnt_catch_branch: "Could you specify the branch? (CSE, ECE, EEE, MECH)",
    nav_specific_fail: (text: string) => `I couldn't find "${text}" in this section. Try saying the exact name (e.g., 'CSE' or 'Library') or say 'Restart'.`,
    excelent_choice: (name: string) => `Excellent choice. Navigating to ${name}.`,
    did_you_mean: (options: string) => `I couldn't find that exactly, but did you mean one of these?`,
    nav_not_found_try_these: (options: string) => `I couldn't find that location. However, I found these similar places: ${options}. Would you like to go to one of them?`
  },
  te: {
    greeting: "నమస్కారం! 👋 నేను మీకు లొకేషన్లు లేదా ఫీజు వివరాలు తెలుసుకోవడంలో సహాయపడగలను. 'లైబ్రరీ ఎక్కడ ఉంది?' లేదా 'B.Tech ఫీజులు చూపించు' అని అడగండి.",
    clear: "సరే, మళ్ళీ మొదలుపెడదాం. నేను మీకు ఎలా సహాయం చేయగలను?",
    unknown: "నాకు అర్థం కాలేదు. దయచేసి 'ఫీజులు' లేదా 'డైరెక్షన్స్' కోసం అడగండి.",
    nav_category_prompt: "తప్పకుండా! మీరు అడ్మినిస్ట్రేటివ్ ఆఫీసులు 🏛️, అకాడెమిక్ విభాగాలు 🎓, లేదా సాధారణ సౌకర్యాలు ☕ కోసం చూస్తున్నారా?",
    nav_found: (name: string) => `దొరికింది! మిమ్మల్ని ${name}కి తీసుకెళ్తున్నాను.`,
    nav_not_found: "ఆ లొకేషన్ దొరకలేదు. 😕 దయచేసి విభాగం (ఉదా., 'CSE'), 'లైబ్రరీ' లేదా 'క్యాంటీన్' కోసం వెతకండి.",
    fee_missing_course: "మీకు ఏ కోర్సుపై ఆసక్తి ఉంది? (B.Tech, MBA, Diploma)",
    fee_missing_branch: (course: string) => `${course}లో, ఏ బ్రాంచ్? (ఉదా., CSE, ECE)`,
    fee_opening: (c: string, b: string) => `${c} - ${b} ఫీజు వివరాలను తెరుస్తున్నాను...`,
    clarify_admin: "సరే, అడ్మినిస్ట్రేటివ్ విభాగం. 🏛️\nమీరు ప్రిన్సిపాల్ ఛాంబర్, అడ్మిన్ ఆఫీస్, పరీక్షల విభాగం లేదా NCC గది కోసం చూస్తున్నారా?",
    clarify_academic: "అకాడెమిక్ విభాగాలు. 🎓\nమా దగ్గర CSE, ECE, EEE, మెకానికల్ మరియు సివిల్ ఉన్నాయి. మీరు దేనిని సందర్శించాలనుకుంటున్నారు?",
    clarify_amenity: "సాధారణ సౌకర్యాలు. ☕\nనేను మిమ్మల్ని సెంట్రల్ లైబ్రరీ, క్యాంటీన్, సెమినార్ హాల్ లేదా గర్ల్స్ వెయిటింగ్ రూమ్‌కి తీసుకెళ్ళగలను. మీ ఎంపిక ఏమిటి?",
    clarify_fail: "నాకు సరిగ్గా అర్థం కాలేదు. దయచేసి ఎంచుకోండి: 'అడ్మినిస్ట్రేటివ్', 'విభాగాలు' లేదా 'సౌకర్యాలు'.",
    disambiguate: (options: string) => `నాకు కొన్ని ప్రదేశాలు దొరికాయి. మీరు ${options} అనుకుంటున్నారా?`,
    cancelled: "సరే, రద్దు చేయబడింది. నేను మీకు ఇంకా ఏమి సహాయం చేయగలను?",
    still_trouble: "నాకు ఇంకా ఇబ్బందిగా ఉంది. ఖచ్చితమైన విభాగం లేదా బ్లాక్ పేరు కోసం వెతకడానికి ప్రయత్నించండి.",
    didnt_catch_course: "నాకు అది అర్థం కాలేదు. దయచేసి B.Tech, MBA లేదా Diploma చెప్పండి.",
    didnt_catch_branch: "మీరు బ్రాంచ్ చెప్పగలరా? (CSE, ECE, EEE, MECH)",
    nav_specific_fail: (text: string) => `ఈ విభాగంలో "${text}" దొరకలేదు. ఖచ్చితమైన పేరు (ఉదా., 'CSE' లేదా 'లైబ్రరీ') చెప్పండి లేదా 'Restart' చెప్పండి.`,
    excelent_choice: (name: string) => `మంచి ఎంపిక. ${name}కి నావిగేట్ చేస్తున్నాను.`,
    did_you_mean: (options: string) => `నాకు అది ఖచ్చితంగా దొరకలేదు, కానీ మీరు వీటిలో ఒకదానిని ఉద్దేశించారా?`,
    nav_not_found_try_these: (options: string) => `ఆ లొకేషన్ దొరకలేదు. అయితే, నాకు ఈ ప్రదేశాలు దొరికాయి: ${options}. మీరు వీటిలో ఒకదానికి వెళ్లాలనుకుంటున్నారా?`
  },
  hi: {
    greeting: "नमस्ते! 👋 मैं आपको स्थान खोजने या शुल्क विवरण की जांच करने में मदद कर सकता हूं। 'लाइब्रेरी कहां है?' या 'B.Tech फीस दिखाएं' पूछने का प्रयास करें।",
    clear: "ठीक है, फिर से शुरू करते हैं। मैं आपकी कैसे मदद कर सकता हूँ?",
    unknown: "मुझे यकीन नहीं है कि मैं समझ पाया। 'फीस' या 'दिशा-निर्देश' (Directions) मांगने का प्रयास करें।",
    nav_category_prompt: "ज़रूर! क्या आप प्रशासनिक कार्यालय 🏛️, शैक्षणिक विभाग 🎓, या सामान्य सुविधाएं ☕ ढूंढ रहे हैं?",
    nav_found: (name: string) => `मिल गया! आपको ${name} ले जा रहा हूँ।`,
    nav_not_found: "मुझे वह स्थान नहीं मिला। 😕 विभाग (जैसे, 'CSE'), 'लाइब्रेरी' या 'कैंटीन' खोजने का प्रयास करें।",
    fee_missing_course: "आप किस कोर्स में रुचि रखते हैं? (B.Tech, MBA, Diploma)",
    fee_missing_branch: (course: string) => `${course} के लिए, कौन सा ब्रांच? (जैसे, CSE, ECE)`,
    fee_opening: (c: string, b: string) => `${c} - ${b} के लिए शुल्क संरचना खोल रहा हूँ...`,
    clarify_admin: "ठीक है, प्रशासनिक अनुभाग। 🏛️\nक्या आप प्रिंसिपल चैंबर, एडमिन ऑफिस, परीक्षा सेल या एनसीसी रूम ढूंढ रहे हैं?",
    clarify_academic: "समझ गया, शैक्षणिक विभाग। 🎓\nहमारे पास CSE, ECE, EEE, मैकेनिकल और सिविल हैं। आप किस पर जाना चाहेंगे?",
    clarify_amenity: "सामान्य सुविधाएं। ☕\nमैं आपको सेंट्रल लाइब्रेरी, कैंटीन, सेमिनार हॉल या गर्ल्स वेटिंग रूम ले जा सकता हूँ। आपकी पसंद क्या है?",
    clarify_fail: "मुझे बिल्कुल समझ नहीं आया। कृपया चुनें: 'प्रशासनिक', 'विभाग', या 'सुविधाएं' ।",
    disambiguate: (options: string) => `मुझे कुछ जगहें मिलीं। क्या आपका मतलब ${options} था?`,
    cancelled: "ठीक है, रद्द कर दिया गया। मैं और क्या मदद कर सकता हूँ?",
    still_trouble: "मुझे अभी भी परेशानी हो रही है। सटीक विभाग या ब्लॉक नाम खोजने का प्रयास करें।",
    didnt_catch_course: "मैंने वह नहीं पकड़ा। कृपया B.Tech, MBA, या Diploma कहें।",
    didnt_catch_branch: "क्या आप ब्रांच निर्दिष्ट कर सकते हैं? (CSE, ECE, EEE, MECH)",
    nav_specific_fail: (text: string) => `मुझे इस अनुभाग में "${text}" नहीं मिला। सटीक नाम (जैसे, 'CSE' या 'लाइब्रेरी') कहने का प्रयास करें या 'Restart' कहें।`,
    excelent_choice: (name: string) => `उत्कृष्ट पसंद। ${name} पर नेविगेट कर रहा हूँ।`,
    did_you_mean: (options: string) => `मुझे वह बिल्कुल नहीं मिला, लेकिन क्या आपका मतलब इनमें से कोई था?`,
    nav_not_found_try_these: (options: string) => `मुझे वह स्थान नहीं मिला। हालाँकि, मुझे ये समान स्थान मिले: ${options}। क्या आप उनमें से किसी एक पर जाना चाहेंगे?`
  }
};

// --- Constants & Patterns ---
const GREETINGS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'hola', 'namaste', 'namaskaram'];
const NAV_KEYWORDS = ['where', 'go', 'find', 'navigate', 'direction', 'route', 'way', 'location', 'map', 'take me', 'kahan', 'ekkada', 'velli', 'jaana'];
const FEE_KEYWORDS = ['fee', 'cost', 'price', 'tuition', 'money', 'pay', 'seat', 'shulk', 'kharcha', 'fees'];

// --- Helper: Intent Detection ---
const detectIntent = (text: string, context: AgentContext): IntentType => {
  const lower = text.toLowerCase();
  
  if (lower === 'clear' || lower === 'reset' || lower === 'restart') return IntentType.CLEAR;
  if (GREETINGS.some(g => lower.startsWith(g))) return IntentType.GREETING;
  if (FEE_KEYWORDS.some(k => lower.includes(k))) return IntentType.FEE;

  // Check FAQs
  const faqMatch = FAQS.find(f => 
    lower.includes(f.question.toLowerCase()) || 
    f.keywords.some(k => lower.includes(k.toLowerCase()))
  );
  if (faqMatch) return IntentType.FAQ;
  
  // Navigation is the fallback if keywords match OR if it looks like a location search
  if (NAV_KEYWORDS.some(k => lower.includes(k))) return IntentType.NAVIGATE;
  
  // Context-aware fallback: If previous intent was NAVIGATE or FEE, assume continuation
  if (context.lastIntent === IntentType.NAVIGATE) return IntentType.NAVIGATE;
  if (context.lastIntent === IntentType.FEE) return IntentType.FEE;

  return IntentType.UNKNOWN;
};

// --- Helper: Entity Extraction ---
const extractFeeEntities = (text: string) => {
  const lower = text.toLowerCase();
  
  // Detect Course
  let course: string | undefined;
  if (lower.includes('b.tech') || lower.includes('btech')) course = 'B.Tech';
  else if (lower.includes('mba')) course = 'MBA';
  else if (lower.includes('diploma') || lower.includes('polytechnic')) course = 'Diploma';
  else if (lower.includes('m.tech') || lower.includes('mtech')) course = 'M.Tech';

  // Detect Branch
  let branch: string | undefined;
  if (lower.includes('cse') || lower.includes('computer')) branch = 'CSE';
  else if (lower.includes('ece') || lower.includes('electronics')) branch = 'ECE';
  else if (lower.includes('eee') || lower.includes('electrical')) branch = 'EEE';
  else if (lower.includes('mech')) branch = 'MECH';
  else if (lower.includes('civil')) branch = 'CIVIL';
  else if (lower.includes('it') || lower.includes('information')) branch = 'IT';
  else if (lower.includes('cme')) branch = 'CME';
  else if (lower.includes('vlsi')) branch = 'VLSI';
  else if (lower.includes('cad') || lower.includes('cam')) branch = 'CAD / CAM';
  else if (lower.includes('power') || lower.includes('eps')) branch = 'POWER SYSTEMS';
  else if (lower.includes('structural') || lower.includes('se')) branch = 'STRUCTURAL ENGINEERING';
  else if (lower.includes('thermal') || lower.includes('te')) branch = 'THERMAL ENGINEERING';

  return { course, branch };
};

// --- Core: Conversation Manager ---
export const processUserMessage = (
  text: string, 
  context: AgentContext,
  lang: 'en' | 'te' | 'hi' = 'en'
): AgentResponse => {
  const intent = detectIntent(text, context);
  const lowerText = text.toLowerCase();
  const t = RESPONSE_TEMPLATES[lang];
  
  // Get Localized Locations for Search
  const localLocations = getLocations(lang);

  // 1. Handle Clarifications (Multi-turn)
  if (context.awaitingClarification) {
    
    // --- Fee Flow Clarifications ---
    if (context.clarificationType === 'FEE_COURSE') {
       const extracted = extractFeeEntities(text);
       if (extracted.course) {
         return handleFeeFlow({ ...context.partialFeeData, course: extracted.course }, { ...context, awaitingClarification: false }, t);
       }
       return {
         message: t.didnt_catch_course,
         action: { type: 'NONE' },
         updatedContext: context,
         options: ['B.Tech', 'MBA', 'Diploma', 'M.Tech']
       };
    }
    
    if (context.clarificationType === 'FEE_BRANCH') {
       const extracted = extractFeeEntities(text);
       if (extracted.branch) {
         return handleFeeFlow({ ...context.partialFeeData, branch: extracted.branch }, { ...context, awaitingClarification: false }, t);
       }
       return {
         message: t.didnt_catch_branch,
         action: { type: 'NONE' },
         updatedContext: context,
         options: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']
       };
    }

    // --- Navigation Category Selection ---
    if (context.clarificationType === 'NAV_CATEGORY') {
        // Administrative Mapping
        if (lowerText.includes('admin') || lowerText.includes('office') || lowerText.includes('principal') || lowerText.includes('prashasan')) {
             return {
                 message: t.clarify_admin,
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'NAV_SPECIFIC_SELECT',
                     categoryFilter: 'administrative'
                 },
                 options: ['Principal Office', 'Admin Office', 'Exam Cell']
             };
        } 
        // Academic Mapping
        else if (lowerText.includes('academic') || lowerText.includes('dept') || lowerText.includes('department') || lowerText.includes('class') || lowerText.includes('study') || lowerText.includes('vibhag')) {
             return {
                 message: t.clarify_academic,
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'NAV_SPECIFIC_SELECT',
                     categoryFilter: 'academic'
                 },
                 options: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']
             };
        } 
        // Amenities Mapping
        else if (lowerText.includes('amenity') || lowerText.includes('common') || lowerText.includes('mess') || lowerText.includes('library') || lowerText.includes('food') || lowerText.includes('restroom') || lowerText.includes('suvidha')) {
             return {
                 message: t.clarify_amenity,
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'NAV_SPECIFIC_SELECT',
                     categoryFilter: 'amenity'
                 },
                 options: ['Library', 'Canteen', 'Seminar Hall']
             };
        }
        
        // Fallback: If they skipped category and named a specific place
        const matches = searchLocations(text, localLocations);
        if (matches.length > 0) {
            return {
                message: t.nav_found(matches[0].name),
                action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                updatedContext: { ...context, lastIntent: IntentType.NAVIGATE } 
            };
        }

        return {
            message: t.clarify_fail,
            action: { type: 'NONE' },
            updatedContext: context,
            options: ['Administrative', 'Academic', 'Amenities']
        };
    }

    // --- Navigation Specific Selection ---
    if (context.clarificationType === 'NAV_SPECIFIC_SELECT') {
        // Search globally first in current language
        let matches = searchLocations(text, localLocations);

        // If we have a category filter, prioritize matches in that category
        if (context.categoryFilter) {
            const categoryMatches = matches.filter(m => m.category === context.categoryFilter);
            if (categoryMatches.length > 0) {
                matches = categoryMatches; // Use filtered list
            }
        }

        if (matches.length > 0) {
            return {
                message: t.excelent_choice(matches[0].name),
                action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
            };
        } else {
             // Handle Department nicknames manually
             if (context.categoryFilter === 'academic') {
                if (lowerText.includes('computer') || lowerText.includes('cs')) matches = searchLocations('CSE', localLocations);
                else if (lowerText.includes('electronic') || lowerText.includes('ec')) matches = searchLocations('ECE', localLocations);
                else if (lowerText.includes('electric') || lowerText.includes('ee')) matches = searchLocations('EEE', localLocations);
                else if (lowerText.includes('civil')) matches = searchLocations('Civil', localLocations);
                else if (lowerText.includes('mech')) matches = searchLocations('MECH', localLocations);
                
                if (matches.length > 0) {
                    return {
                        message: t.excelent_choice(matches[0].name),
                        action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                        updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
                    };
                }
             }

             return {
                 message: t.nav_specific_fail(text),
                 action: { type: 'NONE' },
                 updatedContext: context
             };
        }
    }

    if (context.clarificationType === 'LOCATION_CONFIRM') {
        if (lowerText.includes('yes') || lowerText.includes('yeah') || lowerText.includes('ok') || lowerText.includes('sure') || lowerText.includes('ha') || lowerText.includes('avunu')) {
             return {
                message: t.nav_found(context.potentialLocation?.name || ''),
                action: { type: 'NAVIGATE', payload: { initialQuery: context.potentialLocation?.name } },
                updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
             };
        } else {
            return {
                message: t.cancelled,
                action: { type: 'NONE' },
                updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
            };
        }
    }

    if (context.clarificationType === 'LOCATION_DISAMBIGUATE') {
        const matches = searchLocations(text, localLocations);
        if (matches.length > 0) {
             return {
                message: t.nav_found(matches[0].name),
                action: { type: 'NAVIGATE', payload: { initialQuery: matches[0].name } },
                updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
             };
        } else {
             return {
                 message: t.still_trouble,
                 action: { type: 'NONE' },
                 updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
             };
        }
    }
  }

  // 2. Handle New Intents
  switch (intent) {
    case IntentType.GREETING:
      return {
        message: t.greeting,
        action: { type: 'NONE' },
        updatedContext: { ...context, lastIntent: IntentType.GREETING }
      };

    case IntentType.CLEAR:
      return {
        message: t.clear,
        action: { type: 'NONE' },
        updatedContext: {}
      };

    case IntentType.FEE:
      const entities = extractFeeEntities(text);
      return handleFeeFlow(entities, { ...context, lastIntent: IntentType.FEE }, t);

    case IntentType.FAQ:
      const faq = FAQS.find(f => 
        lowerText.includes(f.question.toLowerCase()) || 
        f.keywords.some(k => lowerText.includes(k.toLowerCase()))
      );
      if (faq) {
        return {
          message: faq.answer,
          action: { type: 'NONE' },
          updatedContext: { ...context, lastIntent: IntentType.FAQ }
        };
      }
      return {
          message: t.unknown,
          action: { type: 'NONE' },
          updatedContext: context
      };

    case IntentType.NAVIGATE:
    case IntentType.UNKNOWN: // Treat unknown as potential navigation search
      // Remove common English keywords
      const cleanQuery = text.replace(/i need|want to|help|navigation|where is|go to|find|navigate to|show me|the|directions to|location|take me to|ekkada|kahan|hai/gi, '').trim();
      
      // If query is too short or empty, it means user asked "Directions" or "Navigation help" without specific location
      if (cleanQuery.length < 3) {
          return {
              message: t.nav_category_prompt,
              action: { type: 'NONE' },
              updatedContext: {
                  ...context,
                  awaitingClarification: true,
                  clarificationType: 'NAV_CATEGORY',
                  lastIntent: IntentType.NAVIGATE
              },
              options: ['Administrative', 'Academic', 'Amenities']
          };
      }

      const matches = searchLocations(cleanQuery, localLocations);
      
      if (matches.length > 0) {
        const topMatch = matches[0];
        
        // Exact or High Confidence Match
        const isStrongMatch = topMatch.name.toLowerCase().includes(cleanQuery.toLowerCase()) || 
                              cleanQuery.toLowerCase().includes(topMatch.name.toLowerCase());

        if (isStrongMatch || matches.length === 1) {
             return {
                message: t.nav_found(topMatch.name),
                action: { type: 'NAVIGATE', payload: { initialQuery: topMatch.name } },
                updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
             };
        } else {
             // Ambiguous or Fuzzy Match
             // Present top 3 options
             const options = matches.slice(0, 3).map(m => m.name);
             return {
                 message: t.did_you_mean(options.join(", ")),
                 action: { type: 'NONE' },
                 updatedContext: {
                     ...context,
                     awaitingClarification: true,
                     clarificationType: 'LOCATION_DISAMBIGUATE',
                     lastIntent: IntentType.NAVIGATE
                 },
                 options: options
             };
        }
      } else {
        return {
          message: t.nav_not_found,
          action: { type: 'NONE' },
          updatedContext: { ...context, lastIntent: IntentType.NAVIGATE }
        };
      }
  }

  return {
    message: t.unknown,
    action: { type: 'NONE' },
    updatedContext: context
  };
};

// --- Sub-Flow: Fees ---
function handleFeeFlow(data: { course?: string; branch?: string }, currentContext: AgentContext, t: any): AgentResponse {
   // 1. Missing Course
   if (!data.course) {
     return {
       message: t.fee_missing_course,
       action: { type: 'NONE' },
       updatedContext: {
         ...currentContext,
         awaitingClarification: true,
         clarificationType: 'FEE_COURSE',
         partialFeeData: data
       },
       options: ['B.Tech', 'MBA', 'Diploma', 'M.Tech']
     };
   }

   // 2. Missing Branch
   if (!data.branch) {
     return {
       message: t.fee_missing_branch(data.course),
       action: { type: 'NONE' },
       updatedContext: {
         ...currentContext,
         awaitingClarification: true,
         clarificationType: 'FEE_BRANCH',
         partialFeeData: data
       },
       options: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']
     };
   }

   // 3. All Good
   return {
     message: t.fee_opening(data.course, data.branch),
     action: { 
         type: 'SHOW_FEES',
         payload: { initialCourse: data.course, initialBranch: data.branch }
     },
     updatedContext: { ...currentContext, lastIntent: IntentType.FEE }
   };
}
