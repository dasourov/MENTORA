export type Adviser = {
  id: string;
  name: string;
  headline: string;
  location: string;
  countries: string[];
  specialisation: string;
  expertise: string[];
  levels: string[];
  languages: string[];
  years: number;
  rating: number;
  reviews: number;
  students: number;
  price: number;
  match: number;
  matchReason: string;
  nextAvailable: string;
  responseTime: string;
  bio: string;
  approach: string;
  commission: string;
  verified: boolean;
  services: AdviserService[];
  photo: string;
};

export type AdviserService = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  includes: string[];
};

export const formatBDT = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

const baseServices = (prefix: string): AdviserService[] => [
  {
    id: `${prefix}-profile`,
    name: "30-minute profile evaluation",
    description: "A focused review of your academic record, budget and destination fit.",
    duration: "30 min",
    price: 500,
    includes: ["Academic profile review", "Realistic destination options", "Written summary"],
  },
  {
    id: `${prefix}-shortlist`,
    name: "University shortlist review",
    description: "Build a balanced list of ambitious, target and safe universities.",
    duration: "60 min",
    price: 1500,
    includes: ["8–12 university shortlist", "Deadline map", "Tuition and cost comparison"],
  },
  {
    id: `${prefix}-sop`,
    name: "SOP feedback session",
    description: "Line-by-line feedback on your statement of purpose with a rewrite plan.",
    duration: "45 min",
    price: 1000,
    includes: ["Structure critique", "Annotated document", "One follow-up revision"],
  },
  {
    id: `${prefix}-strategy`,
    name: "Application strategy session",
    description: "A step-by-step application plan for your chosen intake.",
    duration: "60 min",
    price: 2500,
    includes: ["Intake timeline", "Document checklist", "Portal walkthrough"],
  },
  {
    id: `${prefix}-scholarship`,
    name: "Scholarship consultation",
    description: "Identify funding you are genuinely competitive for and how to apply.",
    duration: "45 min",
    price: 1500,
    includes: ["Scholarship long list", "Eligibility screening", "Essay pointers"],
  },
  {
    id: `${prefix}-visa`,
    name: "Visa interview preparation",
    description: "Mock interview and financial documentation review.",
    duration: "45 min",
    price: 800,
    includes: ["Mock interview", "Document audit", "Answer framework"],
  },
];

export const advisers: Adviser[] = [
  {
    id: "tanvir-ahmed",
    name: "Tanvir Ahmed",
    headline: "Germany Master's application adviser — public universities & TU9",
    location: "Dhaka, Bangladesh · previously Munich",
    countries: ["Germany", "Austria", "Netherlands"],
    specialisation: "Germany Master's applications",
    expertise: ["Uni-Assist", "APS Bangladesh", "Blocked account", "CS & Engineering"],
    levels: ["Master's", "MBA"],
    languages: ["Bangla", "English", "German (B2)"],
    years: 7,
    rating: 4.9,
    reviews: 186,
    students: 412,
    price: 800,
    match: 92,
    matchReason:
      "Strong experience with German Master's applications, Computer Science students, and scholarship guidance.",
    nextAvailable: "Tomorrow, 7:00 PM",
    responseTime: "Under 2 hours",
    bio: "I completed my MSc in Informatics at TU München as a self-funded student from Dhaka, and I have guided Bangladeshi applicants through Uni-Assist, APS and blocked accounts since 2019. I focus on public universities with no tuition fees, so families spend on living costs rather than agency margins.",
    approach:
      "I start with a hard look at your CGPA, backlogs and budget, then build a shortlist you can actually convert. No false promises — if a profile is not ready, I will tell you what to fix first.",
    commission: "Receives no commission from any university or agency. Student fees only.",
    verified: true,
    services: baseServices("tanvir"),
    photo: "/images/mentors/tanvir.png",
  },
  {
    id: "farhana-rahman",
    name: "Farhana Rahman",
    headline: "UK scholarship adviser — Chevening, Commonwealth & university awards",
    location: "Sylhet, Bangladesh",
    countries: ["United Kingdom", "Ireland"],
    specialisation: "UK scholarships & funded Master's",
    expertise: ["Chevening", "Commonwealth", "Personal statements", "Social sciences"],
    levels: ["Master's", "PhD"],
    languages: ["Bangla", "English"],
    years: 9,
    rating: 4.8,
    reviews: 231,
    students: 530,
    price: 1000,
    match: 88,
    matchReason:
      "Deep track record with UK funded Master's applications and leadership-focused scholarship essays.",
    nextAvailable: "Today, 9:30 PM",
    responseTime: "Under 4 hours",
    bio: "Chevening scholar (University of Edinburgh, 2016). I have reviewed more than 900 scholarship essays and mentored 40+ Bangladeshi Chevening and Commonwealth awardees.",
    approach:
      "Scholarship writing is evidence, not adjectives. We rebuild your essays around measurable impact and a credible return-to-Bangladesh plan.",
    commission: "Receives no commission. Discloses all partner relationships in writing.",
    verified: true,
    services: baseServices("farhana"),
    photo: "/images/mentors/farhana.png",
  },
  {
    id: "sabbir-hossain",
    name: "Sabbir Hossain",
    headline: "Canadian college & university adviser — SDS, PGWP pathways",
    location: "Toronto, Canada",
    countries: ["Canada"],
    specialisation: "Canada college & undergraduate admissions",
    expertise: ["SDS route", "GIC & proof of funds", "PGWP planning", "Business programmes"],
    levels: ["Bachelor's", "Diploma", "Master's"],
    languages: ["Bangla", "English"],
    years: 6,
    rating: 4.7,
    reviews: 148,
    students: 322,
    price: 1500,
    match: 84,
    matchReason:
      "Best fit for students targeting affordable Canadian colleges with a clear post-graduation work permit path.",
    nextAvailable: "Sunday, 11:00 AM",
    responseTime: "Same day",
    bio: "I moved to Ontario as a diploma student in 2017 and now advise families on realistic college and university choices, funding proof and study-permit documentation.",
    approach:
      "Canada is a documentation game. We get your funds, intent and programme choice aligned before a single application fee is paid.",
    commission: "Declares commission from two partner colleges; always shown before booking.",
    verified: true,
    services: baseServices("sabbir"),
    photo: "/images/mentors/sabbir.png",
  },
  {
    id: "nusrat-jahan",
    name: "Nusrat Jahan",
    headline: "Australian student visa adviser — GTE statements & subclass 500",
    location: "Melbourne, Australia",
    countries: ["Australia", "New Zealand"],
    specialisation: "Australia student visa & GTE",
    expertise: ["Subclass 500", "GTE statement", "Health & nursing", "Regional universities"],
    levels: ["Bachelor's", "Master's"],
    languages: ["Bangla", "English"],
    years: 5,
    rating: 4.9,
    reviews: 119,
    students: 240,
    price: 1000,
    match: 81,
    matchReason: "Specialist in subclass 500 visa documentation and GTE statements for Bangladeshi applicants.",
    nextAvailable: "Monday, 8:00 PM",
    responseTime: "Under 6 hours",
    bio: "Former university international admissions officer in Victoria. I now help students write GTE statements that survive scrutiny and avoid avoidable refusals.",
    approach: "Honest GTE writing. We build a story that is true, consistent and verifiable.",
    commission: "Receives no commission from universities.",
    verified: true,
    services: baseServices("nusrat"),
    photo: "/images/mentors/nusrat.png",
  },
  {
    id: "imran-kabir",
    name: "Imran Kabir",
    headline: "Erasmus Mundus & European scholarship adviser",
    location: "Dhaka, Bangladesh",
    countries: ["Sweden", "Italy", "France", "Germany"],
    specialisation: "Erasmus Mundus joint Master's",
    expertise: ["Erasmus Mundus", "Motivation letters", "Consortium choice", "Environment & policy"],
    levels: ["Master's"],
    languages: ["Bangla", "English", "French (A2)"],
    years: 8,
    rating: 4.8,
    reviews: 164,
    students: 361,
    price: 1500,
    match: 79,
    matchReason: "Strong fit for fully funded European joint Master's programmes and motivation letters.",
    nextAvailable: "Tomorrow, 10:00 PM",
    responseTime: "Under 12 hours",
    bio: "Erasmus Mundus alumnus (Sweden & Italy). I help applicants pick consortia where they are competitive instead of applying blindly to the most famous ones.",
    approach: "Programme selection first, writing second. Fit decides funding.",
    commission: "No commission relationships.",
    verified: true,
    services: baseServices("imran"),
    photo: "/images/mentors/imran.png",
  },
  {
    id: "ayesha-siddika",
    name: "Ayesha Siddika",
    headline: "Computer Science admission adviser — US & Canada research tracks",
    location: "Dhaka, Bangladesh",
    countries: ["United States", "Canada"],
    specialisation: "Computer Science admissions",
    expertise: ["Research SOP", "Professor outreach", "Funded MS/PhD", "GRE planning"],
    levels: ["Master's", "PhD"],
    languages: ["Bangla", "English"],
    years: 6,
    rating: 4.9,
    reviews: 97,
    students: 188,
    price: 2500,
    match: 76,
    matchReason: "Specialises in funded CS Master's and PhD applications with professor outreach.",
    nextAvailable: "Friday, 9:00 PM",
    responseTime: "Under 8 hours",
    bio: "CS PhD candidate advising BUET, DU and NSU students on funded research admissions in North America.",
    approach: "We target labs, not rankings. Emails to professors decide funding more than test scores.",
    commission: "No commission relationships.",
    verified: true,
    services: baseServices("ayesha"),
    photo: "/images/mentors/ayesha.png",
  },
];

export const getAdviser = (id: string) => advisers.find((a) => a.id === id);

export const popularServices = [
  { name: "Profile Evaluation", description: "Know where you realistically stand before you spend.", price: 500 },
  { name: "University Shortlisting", description: "A balanced list matched to budget and grades.", price: 1500 },
  { name: "Scholarship Guidance", description: "Funding you are genuinely competitive for.", price: 1500 },
  { name: "SOP Feedback", description: "Structured, honest feedback on your statement.", price: 1000 },
  { name: "Application Support", description: "End-to-end help through portals and deadlines.", price: 2500 },
  { name: "Visa Interview Preparation", description: "Mock interviews and document audits.", price: 800 },
];

export const testimonials = [
  {
    name: "Rafiul Islam",
    detail: "BUET · MSc Informatics, TU Darmstadt",
    quote:
      "I had been quoted ৳80,000 by a consultancy. On Mentora I paid for three sessions, understood APS properly, and got admission to two public universities in Germany.",
  },
  {
    name: "Sumaiya Akter",
    detail: "Dhaka University · Chevening Scholar 2025",
    quote:
      "My adviser rewrote how I told my story. The leadership essay finally sounded like evidence instead of claims. I got the Chevening interview and then the award.",
  },
  {
    name: "Mahin Chowdhury",
    detail: "North South University · Conestoga College, Canada",
    quote:
      "The commission disclosure is what convinced me. I could see exactly why a college was recommended, and my visa file was accepted on the first attempt.",
  },
];

export const roadmapStages = [
  { name: "Profile evaluation", status: "done" },
  { name: "Country selection", status: "done" },
  { name: "University shortlisting", status: "current" },
  { name: "Document preparation", status: "todo" },
  { name: "SOP review", status: "todo" },
  { name: "Applications submitted", status: "todo" },
  { name: "Admission decisions", status: "todo" },
  { name: "Visa preparation", status: "todo" },
] as const;

export const studentRequests = [
  { name: "Nafisa Tabassum", topic: "Germany MSc in Data Science", budget: 1500, when: "12 min ago" },
  { name: "Zahid Hasan", topic: "SOP feedback for TU Berlin", budget: 1000, when: "1 hour ago" },
  { name: "Tasnim Rahman", topic: "Scholarship options in Sweden", budget: 800, when: "3 hours ago" },
  { name: "Ariful Islam", topic: "APS document review", budget: 500, when: "Yesterday" },
];

export const earnings = [
  { month: "Mar", amount: 42000 },
  { month: "Apr", amount: 51500 },
  { month: "May", amount: 47800 },
  { month: "Jun", amount: 62400 },
  { month: "Jul", amount: 71200 },
  { month: "Aug", amount: 84600 },
];

export const verificationQueue = [
  { name: "Rezwan Kabir", expertise: "Japan · MEXT", submitted: "12 Jul 2026", docs: 4, status: "Pending review" },
  { name: "Shirin Sultana", expertise: "UK · Undergraduate", submitted: "10 Jul 2026", docs: 5, status: "Documents requested" },
  { name: "Adnan Faisal", expertise: "Canada · Colleges", submitted: "09 Jul 2026", docs: 3, status: "Pending review" },
  { name: "Maliha Noor", expertise: "Germany · Engineering", submitted: "07 Jul 2026", docs: 6, status: "Approved" },
  { name: "Tauhid Alam", expertise: "USA · CS PhD", submitted: "04 Jul 2026", docs: 2, status: "Rejected" },
];

export const reviewsData = [
  {
    name: "Rafiul Islam",
    date: "June 2026",
    rating: 5,
    text: "Clear, honest and extremely well prepared. He knew the exact Uni-Assist quirks for Bangladeshi transcripts and saved me two months of guessing.",
    service: "Germany application strategy",
  },
  {
    name: "Sadia Kabir",
    date: "May 2026",
    rating: 5,
    text: "My shortlist went from wishful thinking to a real plan. Three offers, two of them tuition free.",
    service: "University shortlist review",
  },
  {
    name: "Naimul Hoque",
    date: "April 2026",
    rating: 4,
    text: "Very useful SOP feedback. Would have liked a longer session, but the written notes were detailed.",
    service: "SOP feedback session",
  },
];