const WHOOSH_REPOSITORY_URL = "https://github.com/caem366/whoosh-sandbox";
const WHOOSH_DEMO_URL = "https://whoosh-sandbox.vercel.app/";
const WHOOSH_PREVIEW_URL = "/images/whoosh/sandbox-preview.png";

// These links intentionally point outside the portfolio. Set the demo URL in
// the deployment environment when the standalone WHOOSH application is published.
export const whooshLinks = {
  demoUrl: import.meta.env.VITE_WHOOSH_DEMO_URL?.trim() || WHOOSH_DEMO_URL,
  repositoryUrl: import.meta.env.VITE_WHOOSH_REPOSITORY_URL?.trim() || WHOOSH_REPOSITORY_URL,
  previewUrl: import.meta.env.VITE_WHOOSH_PREVIEW_URL?.trim() || WHOOSH_PREVIEW_URL,
};

export const hasWhooshDemo = Boolean(whooshLinks.demoUrl);
export const hasWhooshRepository = Boolean(whooshLinks.repositoryUrl);
