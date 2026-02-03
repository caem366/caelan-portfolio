import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { projects } from "../data/projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24 lg:py-32">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4 rounded-sm"
        >
          <span className="mr-2">←</span>
          Back to Projects
        </Link>

        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl leading-tight">
                {project.title}
              </h1>
              {project.inProgress && (
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full whitespace-nowrap mt-1">
                  In Progress
                </span>
              )}
            </div>
            <p className="text-lg leading-relaxed text-zinc-600">
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm text-zinc-600 border border-zinc-200 rounded-xl"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="border-l-2 border-zinc-200 pl-8 py-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">
              Role
            </h2>
            <p className="text-base text-zinc-900">
              {project.role}
            </p>
          </div>

          <div className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-8">
              Key Highlights
            </h2>
            <ul className="space-y-6">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start leading-relaxed text-zinc-600 text-base"
                >
                  <span className="mr-4 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400"></span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white bg-zinc-900 rounded-xl transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4"
                aria-label={`View ${project.title} on GitHub (opens in new tab)`}
              >
                View on GitHub
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-zinc-900 border border-zinc-200 rounded-xl transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4"
                aria-label={`View ${project.title} live demo (opens in new tab)`}
              >
                Live Demo
              </a>
            )}
            {project.figma && (
              <a
                href={project.figma}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-zinc-900 border border-zinc-200 rounded-xl transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4"
                aria-label={`View ${project.title} design on Figma (opens in new tab)`}
              >
                View Design
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
