export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row sm:py-12">
          <p className="text-sm text-zinc-600">
            © {currentYear} Caelan Mason. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/caem366"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-blue-600 transition-colors"
              aria-label="GitHub profile (opens in new tab)"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/caelan-mason-6a300a344/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-blue-600 transition-colors"
              aria-label="LinkedIn profile (opens in new tab)"
            >
              LinkedIn
            </a>
            <a
              href="mailto:caelanmason1@gmail.com"
              className="text-sm text-zinc-600 hover:text-blue-600 transition-colors"
              aria-label="Send email"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
