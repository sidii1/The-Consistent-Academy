import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Clock } from "lucide-react";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@consistentacademy.com", href: "mailto:hello@consistentacademy.com" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "Address", value: "123 Academy Street, Education District, City 12345", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon-Sat: 9:00 AM - 8:00 PM", href: "#" },
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
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for your inquiry. We'll get back to you soon.",
    });
    
    setFormData({ name: "", email: "", phone: "", course: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingBlob className="top-20 -right-32" size="xl" color="primary" />
        <FloatingBlob className="bottom-0 -left-20" size="lg" color="accent" delay={0.5} />

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
              Have questions or ready to enroll? Reach out to us and we'll help you 
              take the first step towards English fluency.
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
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Course Interest</label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                        <option value="">Select a course</option>
                        <option value="ielts">IELTS Preparation</option>
                        <option value="spoken">Spoken English</option>
                        <option value="writing">Writing Skills</option>
                        <option value="grammar">Grammar Mastery</option>
                        <option value="business">Business English</option>
                        <option value="interview">Interview Preparation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-inset-sm border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      placeholder="Tell us about your learning goals..."
                    />
                  </div>

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
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
                <p className="text-muted-foreground">
                  We'd love to hear from you. Whether you have a question about courses, 
                  pricing, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <NeumorphicCard key={index} delay={0.1 * index} className="flex items-start gap-4 p-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                      <a href={info.href} className="text-foreground font-medium hover:text-primary transition-colors">
                        {info.value}
                      </a>
                    </div>
                  </NeumorphicCard>
                ))}
              </div>

              {/* Map Placeholder */}
              <NeumorphicCard className="overflow-hidden" hover={false}>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Map placeholder</p>
                    <p className="text-muted-foreground text-xs">(Embed Google Maps here)</p>
                  </div>
                </div>
              </NeumorphicCard>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ Preview */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
              Common Questions
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              <span className="text-foreground">Frequently </span>
              <span className="text-gradient">Asked</span>
            </AnimatedHeading>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "How long are the courses?", a: "Course duration varies from 4-12 weeks depending on the program. Each course includes structured daily practice sessions." },
              { q: "Do you offer online classes?", a: "Yes! We offer both online and in-person classes. Our online sessions are interactive and just as effective as in-person training." },
              { q: "What's the batch size?", a: "We maintain small batch sizes of 8-12 students to ensure personalized attention and maximum speaking practice for each student." },
            ].map((faq, index) => (
              <NeumorphicCard key={index} delay={0.1 * index} className="p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Contact;
