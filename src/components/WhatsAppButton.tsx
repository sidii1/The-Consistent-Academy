import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

// TODO(owner): confirm this number is on WhatsApp.
const WHATSAPP_URL =
  "https://wa.me/917709109830?text=" + encodeURIComponent("Hi! I'd like to know more about your courses.");

const HIDDEN_ON = ["/admin", "/club", "/login"];

/** Floating one-tap WhatsApp chat button shown on public pages. */
const WhatsAppButton = () => {
  const { pathname } = useLocation();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with The Consistent Academy on WhatsApp"
      onClick={() => trackEvent("click_whatsapp", { location: "floating_button" })}
      className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
};

export default WhatsAppButton;
