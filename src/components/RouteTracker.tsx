import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "@/lib/analytics";

/** Sends a GA4 page_view on every client-side route change. Renders nothing. */
const RouteTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    // Wait a tick so react-helmet has updated document.title for the new route.
    const t = setTimeout(() => trackPageView(pathname + search), 150);
    return () => clearTimeout(t);
  }, [pathname, search]);

  return null;
};

export default RouteTracker;
