import { Gamepad2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { SEO } from "@/components/SEO";

/**
 * Placeholder for the upcoming TCA game. Monetisation (via the same Razorpay
 * integration used elsewhere) is planned for a later release.
 */
const Game = () => (
  <div className="min-h-screen bg-neo-base overflow-x-hidden">
    <SEO
      title="Padre's Sliver Search | The Consistent Academy"
      description="Padre's Sliver Search — a new learning game from The Consistent Academy. Coming soon."
      canonical="/game"
    />
    <Navbar />
    <main>
      <SectionWrapper className="pt-32">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedHeading className="text-neo-fg mb-4">
            Padre's <span className="text-gradient">Sliver Search</span>
          </AnimatedHeading>
          <AnimatedText className="text-neo-muted text-lg mb-10">
            A brand-new game from The Consistent Academy.
          </AnimatedText>
          <NeumorphicCard className="p-10">
            <div className="neo-inset rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
              <Gamepad2 size={36} className="text-neo-accent" />
            </div>
            <p className="inline-flex items-center gap-2 text-neo-accent font-bold uppercase tracking-widest text-sm">
              <Sparkles size={14} /> Coming soon
            </p>
            <p className="text-neo-muted text-sm mt-3">
              We're putting the finishing touches on it. Check back shortly!
            </p>
          </NeumorphicCard>
        </div>
      </SectionWrapper>
    </main>
    <Footer />
  </div>
);

export default Game;
