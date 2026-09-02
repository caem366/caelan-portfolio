import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

type Theme = "light" | "dark";

function getTheme(): Theme {
  const saved = localStorage.getItem("caelan-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("caelan-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--nav-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-[4.75rem] w-[min(100%_-_3rem,76rem)] items-center justify-between gap-5 max-sm:w-[calc(100%-2rem)]">
        <NavLink to="/" className="shrink-0 text-sm font-bold tracking-[-.02em] text-[var(--text)] focus-visible:outline-none" aria-label="Home">CAELAN<span className="text-[var(--accent)]">.</span></NavLink>
        <div className="flex items-center gap-4 text-[.69rem] font-bold uppercase tracking-[.12em] text-[var(--muted)] sm:gap-7">
          <NavLink to="/projects" className={({ isActive }) => `transition-colors hover:text-[var(--accent)] ${isActive ? "text-[var(--accent)]" : ""}`}>Projects</NavLink>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--accent)]">Resume</a>
          <a href="https://github.com/caem366" target="_blank" rel="noopener noreferrer" className="hidden transition-colors hover:text-[var(--accent)] sm:inline">GitHub</a>
          <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}><span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span></button>
        </div>
      </div>
    </nav>
  );
}
