type AnalyticsParams = Record<string, string>;
type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFunction;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim();
let initialized = false;
let lastTrackedPath = "";

function appendAsyncScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (initialized) return;
  initialized = true;

  if (gaMeasurementId) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId, { send_page_view: false });
    appendAsyncScript("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`);
  }

  if (clarityProjectId) {
    const clarity = window.clarity ?? ((...args: unknown[]) => {
      const clarityQueue = clarity.q ?? [];
      clarityQueue.push(args);
      clarity.q = clarityQueue;
    }) as ClarityFunction;
    window.clarity = clarity;
    appendAsyncScript("clarity-script", `https://www.clarity.ms/tag/${encodeURIComponent(clarityProjectId)}`);
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (!gaMeasurementId) return;
  window.gtag?.("event", name, params);
}

export function trackPageView(pathname: string) {
  if (pathname === lastTrackedPath) return;
  lastTrackedPath = pathname;
  trackEvent("page_view", { page_path: pathname });

  const projectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (projectMatch) trackEvent("project_view", { project_slug: projectMatch[1] });
}

export function trackDocumentClick(target: EventTarget | null) {
  if (!(target instanceof Element)) return;

  const trackedElement = target.closest<HTMLElement>("[data-analytics-event]");
  if (trackedElement?.dataset.analyticsEvent) {
    trackEvent(trackedElement.dataset.analyticsEvent, trackedElement.dataset.analyticsValue ? { value: trackedElement.dataset.analyticsValue } : {});
    return;
  }

  const link = target.closest<HTMLAnchorElement>("a[href]");
  if (!link) return;

  const url = new URL(link.href, window.location.origin);
  const projectMatch = url.pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (projectMatch) {
    trackEvent("project_click", { project_slug: projectMatch[1] });
    return;
  }

  if (url.pathname === "/resume.pdf") {
    trackEvent("resume_click");
    return;
  }

  if (url.hostname === "github.com" || url.hostname.endsWith(".github.com")) {
    trackEvent("github_click");
    return;
  }

  if (url.hostname.endsWith("figma.com")) {
    trackEvent(url.pathname.includes("/proto/") ? "figma_prototype_click" : "figma_design_click");
  }
}
