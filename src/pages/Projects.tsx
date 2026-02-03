import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24 lg:py-32">
        <div className="mb-16 sm:mb-20">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl leading-tight">
            Projects
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 max-w-3xl">
            A collection of work showcasing full-stack development, AI integration, and user-centered design.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group block border border-zinc-200 rounded-2xl p-8 sm:p-10 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4"
              aria-label={`View ${project.title} project details`}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 leading-tight">
                  {project.title}
                </h2>
                {project.inProgress && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full whitespace-nowrap">
                    In Progress
                  </span>
                )}
              </div>
              
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                {project.tagline}
              </p>
              
              <p className="mt-6 text-sm text-zinc-500">
                {project.stack.join(" • ")}
              </p>
              
              <div className="mt-8 flex items-center text-sm font-medium text-zinc-900">
                See info
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
