import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Wifi } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SEO } from "@/components/SEO";
import { FAQ } from "@/components/FAQ";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { courses, kidsCourses } from "@/data/courses";
import { courseFaqs } from "@/data/faqs";
import { courseEntries, courseJsonLd } from "@/seo/site";
import { formatINR } from "../../shared/pricing";
import NotFound from "./NotFound";

/** One page per course so each can rank and be linked to on its own. */
const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [payOpen, setPayOpen] = useState(false);

  const entry = courseEntries().find((c) => c.slug === slug);
  if (!entry) return <NotFound />;

  const pro = courses.find((c) => c.slug === slug);
  const kid = kidsCourses.find((c) => c.slug === slug);
  const audienceText = pro
    ? Array.isArray(pro.targetAudience)
      ? pro.targetAudience.join(", ")
      : pro.targetAudience
    : undefined;
  const highlights = pro?.highlights ?? kid?.features;
  const faqs = courseFaqs({
    title: entry.title,
    productId: pro?.productId,
    kidsId: kid?.id,
    duration: entry.duration,
    audience: audienceText,
  });

  return (
    <div className="min-h-screen bg-neo-base overflow-x-hidden">
      <SEO
        title={`${entry.title} | The Consistent Academy`}
        description={`${entry.description} ${formatINR(entry.price)}. ${entry.duration}. The Consistent Academy, Pune and online.`}
        canonical={`/courses/${entry.slug}`}
        schema={courseJsonLd(entry)}
      />
      <Navbar />
      <main>
        <SectionWrapper className="pt-28 md:pt-36 max-sm:pt-24">
          <div className="max-w-4xl mx-auto">
            <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-neo-accent hover:underline mb-6">
              <ArrowLeft size={14} /> All courses
            </Link>

            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-3">
                <h1 className="text-3xl md:text-4xl font-bold text-neo-fg leading-tight">{entry.title}</h1>
                {entry.subtitle && <p className="text-lg text-neo-accent mt-2">{entry.subtitle}</p>}
                <p className="text-neo-muted mt-4 leading-relaxed">{entry.description}</p>

                <div className="flex flex-wrap items-center gap-3 mt-5 text-sm">
                  <span className="neo-inset-sm rounded-full inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-neo-accent">
                    <Clock size={14} /> {entry.duration}
                  </span>
                  {pro && (
                    <span className="neo-inset-sm rounded-full px-3 py-1 font-semibold text-neo-accent">
                      {pro.modules} Modules
                    </span>
                  )}
                  {kid && (
                    <span className="neo-inset-sm rounded-full inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-neo-accent">
                      <Wifi size={14} /> Online
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <NeumorphicButton size="lg" onClick={() => setPayOpen(true)}>
                    Enroll Now · {formatINR(entry.price)} <ArrowRight size={18} />
                  </NeumorphicButton>
                  <Link to="/contact" className="text-neo-accent font-semibold hover:underline">
                    Ask a question
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2">
                <NeumorphicCard className="p-2">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-56 object-cover rounded-neo-inner"
                    decoding="async"
                  />
                </NeumorphicCard>
              </div>
            </div>

            {pro?.promise && (
              <p className="mt-10 text-neo-fg italic text-lg border-l-4 border-neo-accent pl-4">{pro.promise}</p>
            )}

            {audienceText && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-neo-fg mb-2">Who it&apos;s for</h2>
                <p className="text-neo-muted leading-relaxed">{audienceText}</p>
              </div>
            )}

            {highlights && highlights.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-neo-fg mb-4">{pro ? "Course highlights" : "What you'll learn"}</h2>
                <ul className="space-y-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-neo-muted">
                      <CheckCircle size={16} className="text-neo-accent mt-1 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pro && pro.moduleDetails.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-neo-fg mb-4">Course modules</h2>
                <div className="space-y-4">
                  {pro.moduleDetails.map((m) => (
                    <NeumorphicCard key={m.title} className="p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-lg font-semibold text-neo-fg">{m.title}</h3>
                        {m.duration && <span className="text-sm text-neo-accent font-semibold">{m.duration}</span>}
                      </div>
                      <ul className="mt-3 list-disc pl-5 space-y-1 text-neo-muted text-sm">
                        {m.topics.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </NeumorphicCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>

        <FAQ items={faqs} />
      </main>
      <Footer />

      <PaymentModal
        open={payOpen}
        onOpenChange={setPayOpen}
        productId={entry.productId}
        image={entry.image}
        duration={entry.duration}
        highlights={highlights}
      />
    </div>
  );
};

export default CourseDetail;
