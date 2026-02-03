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
  inProgress?: boolean;
}

export const projects: Project[] = [
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
  },
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
  },
  {
    slug: "campusbites",
    title: "CampusBites",
    tagline: "Food delivery platform connecting students with local restaurants",
    role: "Lead Frontend Developer",
    inProgress: true,
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Stripe",
      "Google Maps API",
    ],
    highlights: [
      "Architected modular component system serving 500+ daily active users",
      "Implemented real-time order tracking with WebSocket connections",
      "Integrated Stripe payment processing with subscription management",
      "Optimized bundle size reducing initial load time by 40%",
      "Built admin panel for restaurant partners with analytics dashboard",
    ],
   
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
];