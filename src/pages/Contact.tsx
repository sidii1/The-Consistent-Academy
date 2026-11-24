import { useState } from "react";
import { motion } from "framer-motion";
import { reveal } from "@/lib/device";
import { Send, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { SEO } from "@/components/SEO";
import { routeSeo } from "@/seo/routes";
import { trackEvent } from "@/lib/analytics";
import { FAQ } from "@/components/FAQ";
import { GENERAL_FAQS } from "@/data/faqs";
import { courses, kidsCourses } from "@/data/courses";

// TODO(owner): confirm this number is on WhatsApp.
const WHATSAPP_URL =
  "https://wa.me/917709109830?text=" + encodeURIComponent("Hi! I'd like to know more about your courses.");

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "theconsistentacademy@gmail.com",
    href: "mailto:theconsistentacademy@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 77091 09830",
    href: "tel:+917709109830",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Pune, Maharashtra",
    href: "https://www.google.com/maps/search/?api=1&query=Pune%2C+Maharashtra",
  },
];

const Contact = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // 1️⃣ Prepare Firebase promise
    const firebasePromise = addDoc(
      collection(db, "contactRequests"),
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        message: formData.message,
        createdAt: serverTimestamp(),
        source: "Website Contact Page",
      }
    );

    // 2️⃣ Prepare API promise
    const apiPromise = fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // 3️⃣ Run BOTH in parallel
    const [firebaseResult, apiResponse] = await Promise.all([
      firebasePromise,
      apiPromise,
    ]);

    // 4️⃣ Validate API response
    if (!apiResponse.ok) {
      throw new Error("API request failed");
    }

    trackEvent("generate_lead", { form: "contact", course: formData.course });

    // 5️⃣ Success toast
    toast({
      title: "Message Sent!",
      description: "Thank you for your inquiry. We'll get back to you soon.",
    });

    // 6️⃣ Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      message: "",
    });

  } catch (error) {
    console.error("Contact form error:", error);

    toast({
      title: "Something went wrong",
      description: "Please try again later.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        {...routeSeo("/contact")}
      />
      <Navbar />
      <main>

      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden mb-10">

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">

            <motion.h1
              className="text-4xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-foreground">Get In </span>
              <span className="text-gradient">Touch</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <SectionWrapper className="pt-0 -mt-16 max-sm:mt-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              {...reveal({
                initial: { opacity: 0, x: -50 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.6 },
              }, "none")}
            >
              <NeumorphicCard className="p-8" hover={false}>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm"
                    />
                  </div>

                  {/* Phone & Course */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 00000-00000"
                      className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm"
                    />

                   <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm"
                  >
                    <option value="">Select a course</option>
                    <optgroup label="Adults &amp; professionals">
                      {courses.map((c) => (
                        <option key={c.slug} value={c.title}>{c.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Kids">
                      {kidsCourses.map((c) => (
                        <option key={c.slug} value={c.title}>{c.title}</option>
                      ))}
                    </optgroup>
                    <option value="Leadership Programme (LBFP)">Leadership Programme (LBFP)</option>
                    <option value="Not sure yet">Not sure yet, please advise</option>
                  </select>

                  </div>

                  {/* Message */}
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Tell us about your learning goals..."
                    className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm resize-none"
                  />

                  <NeumorphicButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send size={18} />
                  </NeumorphicButton>
                </form>
              </NeumorphicCard>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              {...reveal({
                initial: { opacity: 0, x: 50 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.6 },
              })}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  {...(info.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => info.label === "Phone" && trackEvent("click_call")}
                  className="block"
                >
                  <NeumorphicCard className="flex gap-4 p-5 hover:-translate-y-0.5 transition-transform">
                    <info.icon className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      <p className="font-medium [overflow-wrap:anywhere]">{info.value}</p>
                    </div>
                  </NeumorphicCard>
                </a>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_whatsapp", { location: "contact_page" })}
                className="block"
              >
                <NeumorphicCard className="flex gap-4 p-5 hover:-translate-y-0.5 transition-transform">
                  <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium">Chat with us directly</p>
                  </div>
                </NeumorphicCard>
              </a>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
      <FAQ items={GENERAL_FAQS} />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
