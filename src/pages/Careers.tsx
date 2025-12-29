import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, User, Briefcase } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";

/* ---------------- TYPES ---------------- */

type CareerFormData = {
  name: string;
  email: string;
  role: string;
  experience: string;
  message: string;
};

/* ---------------- PAGE ---------------- */

const Careers = () => {
  const [form, setForm] = useState<CareerFormData>({
    name: "",
    email: "",
    role: "",
    experience: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(
      "Thank you for your interest!\n\nPlease email your details to:\n📧 theconsistentacademy@gmail.com\n\nWe will contact you shortly."
    );

    setForm({
      name: "",
      email: "",
      role: "",
      experience: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <SectionWrapper className="pt-32">
        <div className="text-center max-w-3xl mx-auto">
          <AnimatedText className="text-primary uppercase text-sm mb-3">
            Careers
          </AnimatedText>

          <AnimatedHeading>
            Join <span className="text-gradient">The Consistent Academy</span>
          </AnimatedHeading>

          <AnimatedText className="text-muted-foreground text-lg mt-6">
            We’re always looking for passionate educators and mentors who
            believe in consistent growth and meaningful learning.
          </AnimatedText>
        </div>
      </SectionWrapper>

      {/* ROLES */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            "IELTS Trainer",
            "Spoken English Mentor",
            "Teaching Assistant",
            "Writing Skills Coach",
            "Corporate Communication Trainer",
          ].map((role) => (
            <NeumorphicCard key={role} className="text-center p-6">
              <Briefcase className="mx-auto text-primary mb-3" />
              <h3 className="font-semibold text-lg">{role}</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Part-time / Full-time opportunities available
              </p>
            </NeumorphicCard>
          ))}
        </div>
      </SectionWrapper>

      {/* FORM */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <NeumorphicCard className="p-10">
            <div className="text-center mb-8">
              <AnimatedHeading>Apply Now</AnimatedHeading>
              <AnimatedText className="text-muted-foreground mt-3">
                Fill in your details below. For now, submissions will be sent
                directly to our academy email.
              </AnimatedText>

              <p className="mt-4 text-sm text-primary flex justify-center items-center gap-2">
                <Mail size={16} />
                theconsistentacademy@gmail.com
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Applying For
                </label>
                <select
                  name="role"
                  required
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                >
                  <option value="">Select a role</option>
                  <option>IELTS Trainer</option>
                  <option>Spoken English Mentor</option>
                  <option>Teaching Assistant</option>
                  <option>Writing Skills Coach</option>
                  <option>Corporate Communication Trainer</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                  placeholder="e.g. 3 years"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Brief Introduction
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                  placeholder="Tell us about yourself and why you'd like to join"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 text-center">
                <NeumorphicButton type="submit" size="lg">
                  Submit Application <ArrowRight size={18} />
                </NeumorphicButton>
              </div>
            </form>
          </NeumorphicCard>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Careers;
