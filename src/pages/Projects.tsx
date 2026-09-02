import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectArtwork from "../components/ProjectArtwork";
import { projects } from "../data/projects";

export default function Projects() {
  return <div className="site-shell"><Navbar /><main className="site-main py-16 sm:py-24 lg:py-28"><header className="grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-[1.2fr_.8fr]"><div><p className="eyebrow">Selected work / 2026</p><h1 className="display mt-5 text-6xl leading-[.9] sm:text-8xl">Projects</h1></div><p className="self-end max-w-md text-lg leading-8 text-[var(--muted)]">A collection of work showcasing full-stack development, AI integration, and user-centered design.</p></header>
    <section className="mt-12 grid gap-6 md:grid-cols-2">{projects.map((project,index) => <Link key={project.slug} to={`/projects/${project.slug}`} className={`group relative overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--accent)] focus-visible:outline-none ${index % 3 === 0 ? "md:col-span-2" : ""}`} aria-label={`View ${project.title} project details`}>
      <div className={`relative h-56 overflow-hidden border-b border-[var(--line)] sm:h-64 ${index % 3 === 0 ? "md:h-72" : ""}`}><ProjectArtwork index={index} /><div className="absolute left-5 top-5 flex items-center gap-3"><span className="eyebrow text-[var(--art-label)]">Project {String(index+1).padStart(2,"0")}</span>{project.inProgress && <span className="border border-[color:rgba(198,229,93,.5)] bg-[color:rgba(17,21,27,.8)] px-2 py-1 text-[.61rem] font-bold uppercase tracking-[.12em] text-[var(--accent)]">In progress</span>}</div></div>
      <div className="p-6 sm:p-8"><div className="flex items-start justify-between gap-5"><h2 className="display max-w-2xl text-3xl leading-[.98] sm:text-4xl">{project.title}</h2><span className="mt-1 text-xl text-[var(--accent)] transition-transform group-hover:translate-x-1">↗</span></div><p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">{project.tagline}</p><div className="mt-7 grid gap-4 border-t border-[var(--line)] pt-4 text-xs sm:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Role</p><p className="mt-2 text-[var(--text)]">{project.role}</p></div><div><p className="eyebrow">Stack</p><p className="mt-2 leading-5 text-[var(--muted)]">{project.stack.slice(0,5).join(" · ")}</p></div></div></div>
    </Link>)}</section></main><Footer /></div>;
}
