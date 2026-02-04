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
    tagline: "Full-stack app for searching clinical trials by condition using ClinicalTrials.gov API",
    role: "Full Stack Developer",
    inProgress: true,
    stack: [
      "React",
      "Express",
      "Axios",
      "ClinicalTrials.gov API",
      "Node.js",
      "RESTful API",
      "GitHub",
    ],
    highlights: [
      "Developing full-stack app using React and Express to let users search clinical trials by condition",
      "Creating search/filter features for trial phase, status, and location",
      "Designing frontend with React hooks and Axios for API integration",
      "Setting up RESTful API endpoints for backend communication",
      "Planning future features including user authentication, data visualization, and favorites functionality",
      "Managing project structure with frontend/backend separation and version control using GitHub",
    ],
    github: "https://github.com/caem366/campus_bites",
  },
  {
    slug: "campusbites",
    title: "CampusBites — Campus Food Ordering Platform",
    tagline: "Campus-focused food ordering platform designed to simplify how university students discover, order, and pick up meals from on-campus dining locations",
    role: "Full Stack Developer",
    inProgress: true,
    stack: [
      "React (Vite)",
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express",
      "RESTful API",
      "Postman",
      "GitHub",
    ],
    highlights: [
      "Building campus-focused food ordering platform solving student pain points like unclear food availability, long wait times, and inefficient navigation",
      "Developing frontend with React (Vite) to enable students to browse campus food vendors, menus, and view location distance and operating hours",
      "Implementing Google Maps integration for direct navigation to on-campus dining locations",
      "Creating streamlined ordering flow tailored to student use cases, prioritizing speed, clarity, and mobile-friendly UX",
      "Building RESTful API backend with Node.js and Express to manage vendor data, orders, and menu availability",
      "Using Postman for API testing and GitHub for version control and project management",
    ],
  },
  {
    slug: "mood-music-app",
    title: "Mood-Based Music Recommendation App",
    tagline: "Web application that recommends music based on emotional cues extracted from user-provided text input",
    role: "Full Stack Developer",
    inProgress: true,
    stack: [
      "Angular",
      "TypeScript",
      "RxJS",
      "Angular Reactive Forms",
      "Spotify API",
      "Last.fm API",
      "REST APIs",
      "Sentiment Analysis",
      "NLP",
    ],
    highlights: [
      "Developed web application that recommends music based on emotional cues using sentiment and emotion analysis to infer mood and dynamically generate recommendations",
      "Built fully functional frontend and application logic with emotion detection from free-text input and dynamic song/playlist recommendation system",
      "Integrated Spotify API with fallback support planned for Last.fm, designed with API abstraction to allow alternative providers or mock data",
      "Created responsive UI with Angular components, reactive forms, RxJS observables, and routing for seamless user experience",
      "Implemented NLP-driven personalization and reactive frontend architecture prioritizing emotional intelligence and user mood adaptation",
      "Application complete from frontend and logic perspective, with third-party API usage currently constrained by Spotify API quota limitations",
    ],
  },
];