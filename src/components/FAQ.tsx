import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { faqJsonLd } from "@/seo/site";
import type { FaqItem } from "@/data/faqs";

interface FAQProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

/** Accessible FAQ accordion that also publishes FAQPage structured data. */
export const FAQ = ({ items, title = "Frequently asked questions", className }: FAQProps) => {
  if (!items.length) return null;
  return (
    <SectionWrapper className={className}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd(items))}</script>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl max-sm:text-2xl font-bold text-neo-fg text-center mb-8">{title}</h2>
        <NeumorphicCard className="p-2 sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {items.map((f, i) => (
              <AccordionItem key={f.question} value={`faq-${i}`} className="border-neo-fg/10 px-3">
                <AccordionTrigger className="text-left text-neo-fg">{f.question}</AccordionTrigger>
                <AccordionContent className="text-neo-muted leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </NeumorphicCard>
      </div>
    </SectionWrapper>
  );
};

export default FAQ;
