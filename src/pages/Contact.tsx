import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";

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
    href: "#",
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
      await addDoc(collection(db, "contactRequests"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        message: formData.message,
        createdAt: serverTimestamp(),
        source: "Website Contact Page",
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. We'll get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: "",
      });
    } catch (error) {
      console.error("Firestore error:", error);
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
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingBlob className="top-20 -right-32" size="xl" color="primary" />
        <FloatingBlob
          className="bottom-0 -left-20"
          size="lg"
          color="accent"
          delay={0.5}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Contact Us
            </motion.span>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-foreground">Let's Start Your </span>
              <span className="text-gradient">Journey</span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Have questions or ready to enroll? Reach out to us and we'll help
              you take the first step towards English fluency.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <SectionWrapper className="pt-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
                      <option value="IELTS">IELTS Preparation</option>
                      <option value="Spoken English">Spoken English</option>
                      <option value="Business English">Business English</option>
                      <option value="Interview Prep">Interview Preparation</option>
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <NeumorphicCard key={index} className="flex gap-4 p-5">
                  <info.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </NeumorphicCard>
              ))}
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Contact;
