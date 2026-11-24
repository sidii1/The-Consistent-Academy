import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SEO } from "@/components/SEO";
import { routeSeo } from "@/seo/routes";

export const CONTACT_EMAIL = "theconsistentacademy@gmail.com";
export const CONTACT_PHONE = "+91 77091 09830";
/** Bump when any policy text changes. */
export const LEGAL_LAST_UPDATED = "24 November 2026";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  path: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

const policyLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/refund-policy", label: "Refund & Cancellation" },
  { to: "/shipping-policy", label: "Service Delivery" },
];

/** Shared layout for the policy pages (privacy, terms, refund, service delivery). */
export const LegalPage = ({ title, path, intro, sections }: LegalPageProps) => (
  <div className="min-h-screen bg-neo-base overflow-x-hidden">
    <SEO {...routeSeo(path)} />
    <Navbar />
    <main>
      <SectionWrapper className="pt-32 md:pt-36">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl max-sm:text-3xl font-bold text-neo-fg mb-2">{title}</h1>
          <p className="text-sm text-neo-muted mb-8">Last updated: {LEGAL_LAST_UPDATED}</p>

          <NeumorphicCard className="p-8 max-sm:p-5">
            {intro && <div className="text-neo-fg leading-relaxed mb-6">{intro}</div>}
            <div className="space-y-8">
              {sections.map((s, i) => (
                <section key={s.heading}>
                  <h2 className="text-xl font-semibold text-neo-fg mb-2">
                    {i + 1}. {s.heading}
                  </h2>
                  <div className="text-neo-fg/90 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-neo-accent [&_a]:underline">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </NeumorphicCard>

          <nav aria-label="Other policies" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {policyLinks
              .filter((l) => l.to !== path)
              .map((l) => (
                <Link key={l.to} to={l.to} className="text-neo-accent hover:underline">
                  {l.label}
                </Link>
              ))}
          </nav>
        </div>
      </SectionWrapper>
    </main>
    <Footer />
  </div>
);
