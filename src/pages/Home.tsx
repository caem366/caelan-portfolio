import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40">
      <Navbar />
      
      <main className="mx-auto max-w-3xl px-6 py-24 sm:px-8 sm:py-32 lg:py-48">
        <div className="space-y-12">
          <div className="space-y-8">
            <p className="text-sm font-medium tracking-wide text-blue-600 uppercase">
              Software Engineer
            </p>
            
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Caelan Mason
            </h1>
            
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl max-w-2xl">
              I build practical, user-centered web applications with clean interfaces 
              and thoughtful experiences. Currently focused on creating tools that make 
              everyday tasks simpler and more intuitive.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              View Projects
            </Link>
            
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-blue-700 border-2 border-blue-200 rounded-xl transition-all hover:bg-blue-50 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              aria-label="View resume (opens in new tab)"
            >
              Resume
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
