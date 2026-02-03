import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between gap-6">
          <NavLink 
            to="/" 
            className="text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 rounded-sm flex-shrink-0"
            aria-label="Home"
          >
            Caelan Mason
          </NavLink>
          
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive
                  ? "text-sm font-medium text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 rounded-sm"
                  : "text-sm text-zinc-600 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 rounded-sm"
              }
            >
              Projects
            </NavLink>
            
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 rounded-sm"
              aria-label="View resume (opens in new tab)"
            >
              Resume
            </a>
            
            <a
              href="https://github.com/caem366"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline text-sm text-zinc-600 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 rounded-sm"
              aria-label="GitHub profile (opens in new tab)"
            >
              GitHub
            </a>
            
            <a
              href="https://www.linkedin.com/in/caelan-mason-6a300a344/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline text-sm text-zinc-600 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 rounded-sm"
              aria-label="LinkedIn profile (opens in new tab)"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}