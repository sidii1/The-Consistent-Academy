/**
 * Google Analytics 4 wrapper. Does nothing unless VITE_GA_MEASUREMENT_ID is set,
 * so local/dev builds stay clean and the site works without it.
 */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

let initialised = false;

export const initAnalytics = (): void => {
  if (!GA_ID || initialised || typeof document === "undefined") return;
  // Skip automated renderers (prerender) so they don't pollute the numbers.
  if (navigator.webdriver) return;
  initialised = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // SPA: page views are sent manually on route change.
  window.gtag("config", GA_ID, { send_page_view: false });
};

/** Admin and the club portal contain student data; keep them out of analytics. */
const isPrivatePath = (path: string) => path.startsWith("/admin") || path.startsWith("/club") || path.startsWith("/login");

export const trackPageView = (path: string, title?: string): void => {
  if (!window.gtag || isPrivatePath(path)) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  });
};

export const trackEvent = (name: string, params?: Record<string, unknown>): void => {
  if (!window.gtag) return;
  window.gtag("event", name, params);
};
