export interface FAQ {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
}

export const FAQS: FAQ[] = [
  {
    id: 1,
    question: "What is the college address and whom should we contact?",
    answer: "The college is located near Gopalapatnam, Sheelanagar, and Sabbavaram (approx. 6 km).\n\nContact Details:\n• Diploma: Principal – 9553068263\n• B.Tech & M.Tech: Mr. Veerunayudu – 9912012782\n• Management Courses: Mrs. K. Divya – 9885546746",
    keywords: ["address", "contact", "phone", "location", "number", "reach", "where"]
  },
  {
    id: 2,
    question: "When was the college established? What are the college timings?",
    answer: "Established in 2008.\nCollege timings: 9:00 AM to 4:00 PM.",
    keywords: ["established", "year", "timing", "time", "hours", "open", "close", "start"]
  },
  {
    id: 3,
    question: "Whom should we meet for admission?",
    answer: "You can contact the respective coordinators:\n• Diploma: Principal\n• B.Tech & M.Tech: Mr. Veerunayudu\n• Management Courses: Mrs. K. Divya",
    keywords: ["meet", "admission contact", "coordinator", "person"]
  },
  {
    id: 4,
    question: "When can we visit the college?",
    answer: "You can visit between 10:00 AM and 4:00 PM.",
    keywords: ["visit", "visiting", "see"]
  },
  {
    id: 5,
    question: "What courses are offered? Are they regular or online?",
    answer: "All courses are regular. Only MBA is available in online mode.\n\nCourses Offered:\n• Diploma (Engg & Agri)\n• B.Tech (APEAPCET & Lateral)\n• M.Tech\n• BBA, BCA\n• MBA, MCA",
    keywords: ["courses", "offered", "programs", "online", "regular", "available"]
  },
  {
    id: 6,
    question: "Are laboratories available for all departments?",
    answer: "Yes, well-equipped laboratories are available as per syllabus requirements for all engineering departments.",
    keywords: ["lab", "laboratory", "equipment", "practical"]
  },
  {
    id: 7,
    question: "Is fee reimbursement available?",
    answer: "Yes, fee reimbursement is provided as per government eligibility norms.",
    keywords: ["reimbursement", "scholarship", "jvd", "fee support"]
  },
  {
    id: 8,
    question: "Who is eligible for fee reimbursement?",
    answer: "SC, ST, BC, and EBC students are eligible based on income criteria and govt rules. ST students receive it directly in their accounts. Others must pay if not eligible.",
    keywords: ["eligibility", "eligible", "sc", "st", "bc", "ebc", "income"]
  },
  {
    id: 9,
    question: "Apart from fee reimbursement, what other fees must be paid?",
    answer: "• ₹5,000 – College Community Services Fee\n• University Fee\n• From 2nd year: CRT Fee ₹5,000",
    keywords: ["other fees", "extra fee", "building fund", "crt fee", "university fee"]
  },
  {
    id: 10,
    question: "What courses can be joined after 10th class?",
    answer: "Diploma courses.",
    keywords: ["10th", "ssc", "after 10th", "tenth"]
  },
  {
    id: 11,
    question: "What Diploma courses are available and what are the fees?",
    answer: "• Agri Engg (30 seats): ₹45,000\n• Civil: ₹25,000\n• Computer: ₹30,000\n• ECE: ₹30,000\n• EEE: ₹25,000\n• Mech: ₹25,000",
    keywords: ["diploma fee", "polytechnic fee", "diploma courses", "civil", "mech", "eee", "ece", "agri"]
  },
  {
    id: 12,
    question: "How can ITI students join Diploma?",
    answer: "With 10 years education + ITI certificate, via POLYCET or Spot Admission. Can join directly into 2nd year if eligible.",
    keywords: ["iti", "lateral diploma", "polycet"]
  },
  {
    id: 13,
    question: "Is management or spot admission available for Diploma?",
    answer: "Yes, spot admissions are available after certificate verification.",
    keywords: ["diploma spot", "diploma management", "spot admission"]
  },
  {
    id: 14,
    question: "After Intermediate, how can I join B.Tech?",
    answer: "Qualify APEAPCET or Management quota.\nMin marks: 45% (SC/ST/BC), 50% (Others).\nOther state students need migration/equivalence certs.",
    keywords: ["inter", "intermediate", "btech admission", "eamcet", "eapcet", "marks"]
  },
  {
    id: 15,
    question: "How can Polytechnic students join B.Tech 2nd year?",
    answer: "Through APECET or spot admission (Lateral Entry).",
    keywords: ["lateral entry", "ecet", "polytechnic to btech", "2nd year"]
  },
  {
    id: 16,
    question: "What is the college code?",
    answer: "College Code: VSPT",
    keywords: ["code", "counseling code", "eamcet code", "vspt"]
  },
  {
    id: 17,
    question: "What Management degree courses are available after Intermediate?",
    answer: "• BBA – ₹25,000\n• BCA – ₹25,000",
    keywords: ["bba", "bca", "degree", "management degree"]
  },
  {
    id: 18,
    question: "What are the MBA & MCA fee details?",
    answer: "MBA:\n• Convenor: ₹35,000\n• Mgmt: ₹45,000\n• Others: ₹55,000\n\nMCA:\n• Convenor: ₹35,000\n• Mgmt: ₹50,000",
    keywords: ["mba fee", "mca fee", "pg fee", "master"]
  },
  {
    id: 19,
    question: "What MBA specializations are available?",
    answer: "HR, Finance, Marketing, Logistics, Health Care, Operations, Business Analytics.",
    keywords: ["mba specializations", "mba groups", "hr", "finance", "marketing"]
  },
  {
    id: 20,
    question: "How many faculty members are there?",
    answer: "Total Faculty: 200\nPhD Faculty: 30",
    keywords: ["faculty", "staff", "teachers", "phd", "professors"]
  },
  {
    id: 21,
    question: "Can I work and attend only exams?",
    answer: "No, that is not allowed.",
    keywords: ["work and study", "attendance", "distance", "only exams"]
  },
  {
    id: 22,
    question: "What documents are required for admission?",
    answer: "• Transfer Certificate (TC)\n• Study Certificates\n• SSC & Inter Marks Memos\n• Migration/Equivalence (if applicable)",
    keywords: ["documents", "certificates", "required", "admission docs"]
  },
  {
    id: 23,
    question: "Is college bus facility available? What is the fee?",
    answer: "Yes. Fee ranges from ₹25,000 to ₹30,000 depending on distance.",
    keywords: ["bus", "transport", "van", "commute"]
  },
  {
    id: 24,
    question: "Is APSRTC bus facility available?",
    answer: "Yes. All RTC buses going towards Sabbavaram pass near the college.",
    keywords: ["rtc", "public transport", "bus stop"]
  },
  {
    id: 25,
    question: "Is hostel facility available?",
    answer: "Yes, dormitory hostel available.\nFee: ₹40,000 per year (10% increase annually).\nGovt hostels also available for eligible SC/ST/BC.",
    keywords: ["hostel", "accommodation", "stay", "room", "dormitory"]
  },
  {
    id: 26,
    question: "Are there additional skill development programs?",
    answer: "Yes, CRT (Campus Recruitment Training) and Industrial Visits.",
    keywords: ["skills", "training", "crt", "industrial visits", "development"]
  },
  {
    id: 27,
    question: "Is 100% placement guaranteed?",
    answer: "Students must pass all subjects and meet communication standards. Placements are conducted through campus drives.",
    keywords: ["placement", "guarantee", "job", "campus drive"]
  },
  {
    id: 28,
    question: "How many companies have recruited so far? What is the salary range?",
    answer: "Around 30 companies.\nSalary: ₹3 Lakhs to ₹10 Lakhs per annum.\nCompanies: Tilicho Labs, Rinex, TVS, Control Print, 24/7 AI, Sutherland, etc.",
    keywords: ["companies", "recruiters", "salary", "package", "highest package", "jobs"]
  }
];
