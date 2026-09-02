import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initializeAnalytics, trackDocumentClick, trackPageView } from "../lib/analytics";

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initializeAnalytics();
    const onDocumentClick = (event: MouseEvent) => trackDocumentClick(event.target);
    document.addEventListener("click", onDocumentClick, { capture: true });
    return () => document.removeEventListener("click", onDocumentClick, { capture: true });
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}
