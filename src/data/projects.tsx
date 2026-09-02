export interface Project {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  stack: string[];
  highlights: string[];
  github?: string;
  live?: string;
  figma?: string;
  slides?: string;
  embedSlides?: boolean;
  inProgress?: boolean;
}

export const projects: Project[] = [
  {
    slug: "burnout-app",
    title: "Time Management & Burnout Prevention App",
    tagline: "Mobile-first time management app focused on reducing academic burnout",
    role: "UI/UX Designer",
    stack: [
      "Figma",
      "Bootstrap",
      "Wireframing",
      "Prototyping",
      "User Research",
      "Usability Testing",
    ],
    highlights: [
      "Designed multi-page Figma prototype with bottom navigation and key screens for tasks, focus sessions, productivity insights, and self-care",
      "Created wireframes and high-fidelity prototypes using Figma and Bootstrap principles",
      "Conducted user interviews and usability testing to improve task flow and navigation",
      "Designed multiple screens: home, tasks, focus sessions, productivity tracking, and wellness suggestions",
      "Prepared development-ready wireframe system and high-fidelity prototype for future implementation in HTML/CSS/JS or Bootstrap",
    ],
    figma: "https://www.figma.com/design/WJOgtxbWFXWlRFDGTTZPQ7/Time-Management-Burnout-App?node-id=61-181&t=pXYTYMrH4NoQBFya-1",
  },
  {
    slug: "ai-ocr-form",
    title: "AI-Powered Form Filler App",
    tagline: "Angular web form that extracts user data from uploaded ID documents using Azure Computer Vision OCR",
    role: "Full Stack Developer",
    stack: [
      "Angular",
      "Azure Computer Vision OCR",
      "RxJS",
      "HTTPClient",
      "TypeScript",
      "HTML/CSS",
    ],
    highlights: [
      "Built Angular web form that extracts user data from uploaded ID documents using Azure Computer Vision OCR",
      "Designed clean, accessible form interface to capture name, DOB, and address, pre-filled from scanned license/passport images",
      "Used RxJS and HTTPClient to manage image uploads and asynchronous data extraction from AI services",
      "Connected OCR output to form fields with validation and fallback editing to improve accuracy and user control",
      "Completed within a 7-day sprint, balancing frontend design, AI integration, and basic backend setup",
    ],
    github: "https://github.com/caem366/ai-form-filler",
    slides: "/AI-Powered-Form-OCR.pptx",
    embedSlides: true,
  },
  {
    slug: "used-car-price-prediction",
    title: "Used Car Price Prediction Project",
    tagline: "Machine learning notebook that predicts fair used-car prices and classifies listings as bargain, fair, or overpriced",
    role: "Data Scientist",
    stack: [
      "Python",
      "Jupyter Notebook",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Matplotlib",
      "Machine Learning",
    ],
    highlights: [
      "Built supervised regression workflow to estimate fair market prices from mileage, model year, accident history, engine details, brand, fuel type, and transmission",
      "Cleaned price and mileage fields, engineered features for car age, engine liters, cylinders, and accident-missing indicators, and grouped rare categories",
      "Compared mean-price baseline, Linear Regression, and Random Forest models using holdout validation and 5-fold cross-validation",
      "Improved holdout MAE by about 53% with a tuned Random Forest model compared with the mean-price baseline",
      "Created business decision bands that label listings as Bargain, Fair, or Overpriced based on predicted fair value",
      "Analyzed model error by price band, brand, accident history, and car age to identify where predictions are strongest and highest risk",
    ],
    github: "https://github.com/caem366/used_car_project",
  },
  {
    slug: "vinylhub",
    title: "Full-Stack Vinyl Marketplace",
    tagline: "Web application for reselling vinyl records with user authentication and item listing",
    role: "Full Stack Developer + UI/UX Designer",
    stack: [
      "Node.js",
      "Express",
      "Firebase",
      "HTML/CSS",
      "Bootstrap",
      "JavaScript",
    ],
    highlights: [
      "Built full-stack web application with Node.js and Express backend",
      "Designed and implemented user authentication with Firebase",
      "Created responsive layouts using Bootstrap for optimal user experience",
      "Implemented Firebase Realtime Database for secure storage of user data and listings",
      "Wrote project specification and maintained codebase using GitHub with branching strategy",
      "Applied RESTful API concepts to enable efficient browsing and filtering of vinyl records",
    ],
    github: "https://github.com/caem366/vinyl-hub",
    figma: "https://www.figma.com/design/kN1dQDQRKVkUiSEAFWYBjc/Vinylhub-UI-Mockup?node-id=0-1&t=LihJeU4EX53SZ5RI-1",
  },
  {
    slug: "clinical-trial-tracker",
    title: "Clinical Trial Tracker Web App",
    tagline: "TrialFinder React app for finding, saving, comparing, and monitoring clinical trials from ClinicalTrials.gov",
    role: "Full Stack Developer",
    stack: [
      "React 18",
      "Vite",
      "Supabase Auth",
      "Firebase Firestore",
      "Express",
      "MongoDB",
      "Recharts",
      "ClinicalTrials.gov API",
    ],
    highlights: [
      "Built React app for searching ClinicalTrials.gov API v2 by condition, keyword, sponsor, status, phase, country, city, and recruiting state",
      "Implemented natural-language search parsing and relevance ranking using condition keywords, recruiting status, phase, country, and city matches",
      "Created trial detail views showing NCT ID, title, sponsor, phase, status, enrollment, summaries, locations, and update dates",
      "Added authenticated user workflows with Supabase email/password and Google OAuth support",
      "Built saved-trial watchlists with Firebase Firestore persistence and localStorage fallback",
      "Added comparison, dashboard analytics, sponsor intelligence, profile settings, dark mode, and saved-trial change detection",
    ],
    github: "https://github.com/caem366/clinical-trial-tracker",
  },
  {
    slug: "whoosh",
    title: "WHOOSH — Split Payment Platform",
    tagline: "Group payment-splitting platform with an immutable double-entry ledger and sandbox purchase settlement flows",
    role: "Full Stack Developer",
    inProgress: true,
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Express",
      "PostgreSQL",
      "Drizzle ORM",
      "Docker",
    ],
    highlights: [
      "Built a TypeScript monorepo with a React/Vite frontend, Express API, shared package, PostgreSQL, Docker, and Drizzle migrations",
      "Designed an immutable double-entry ledger with balance validation, journal posting, audit events, and idempotency keys",
      "Implemented group APIs for member setup, ledger account creation, wallet funding, and ledger-derived balance retrieval",
      "Built sandbox purchases that validate payer funds, split equal allocations, create settlement obligations, and post related journals atomically",
      "Implemented settlement processing to reconcile member wallet, payable, and receivable balances",
      "Added tested integer-cent money utilities to prevent floating-point errors in financial calculations",
    ],
  },
  {
    slug: "mood-music-app",
    title: "AI Mood-Based Music Recommendation App",
    tagline: "Music recommender where users describe how they feel, then get songs that fit both their mood and listening taste",
    role: "Full Stack Developer",
    stack: [
      "Angular",
      "TypeScript",
      "Node.js",
      "Express",
      "RxJS",
      "Angular Reactive Forms",
      "Hugging Face",
      "DistilRoBERTa",
      "Spotify API",
      "Last.fm API",
      "Custom Ranking Logic",
    ],
    highlights: [
      "Built a mood-to-music flow where users describe how they feel instead of choosing only from preset labels",
      "Connected mood analysis with listening-history signals so recommendations are not only emotionally relevant, but also personal",
      "Moved away from depending entirely on Spotify recommendation/audio-feature data after newer developer apps faced endpoint restrictions",
      "Added Last.fm as a discovery source for similar artists, similar tracks, and tag-based candidate expansion",
      "Separated mood relevance and taste relevance in the recommendation logic so liked artists do not automatically pass every mood request",
      "Production deployment is limited by Spotify development-mode access and extended API approval requirements",
    ],
  },
];
