import { useState } from "react";
import { ArrowRight, Mail, User, Briefcase, Phone } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* ---------------- TYPES ---------------- */

type CareerFormData = {
  name: string;
  email: string;
  contact: string;
  role: string;
  experience: string;
  resumeLink: string;
  message: string;
};

type RoleDetails = {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

/* ---------------- DATA ---------------- */

const roleDetails: RoleDetails[] = [
  {
    title: "IELTS Trainer",
    description: "Help students achieve their desired IELTS band scores through comprehensive training in all four modules.",
    responsibilities: [
      "Conduct IELTS preparation sessions for Listening, Reading, Writing, and Speaking",
      "Provide personalized feedback and improvement strategies",
      "Design and evaluate practice tests"
    ],
    requirements: [
      "IELTS Band 8+ or equivalent certification",
      "2+ years of teaching experience",
      "Strong communication skills"
    ]
  },
  {
    title: "Spoken English Mentor",
    description: "Guide students to improve their conversational English skills and build confidence in communication.",
    responsibilities: [
      "Facilitate interactive speaking sessions",
      "Focus on pronunciation, fluency, and vocabulary building",
      "Create engaging conversational activities"
    ],
    requirements: [
      "Excellent English proficiency",
      "Experience in teaching spoken English",
      "Patient and encouraging teaching style"
    ]
  },
  {
    title: "Teaching Assistant",
    description: "Support our trainers in delivering high-quality education and managing classroom activities.",
    responsibilities: [
      "Assist trainers during sessions",
      "Help with student assessments and grading",
      "Manage learning materials and resources"
    ],
    requirements: [
      "Graduate in any field",
      "Good communication skills",
      "Willingness to learn and grow"
    ]
  },
  {
    title: "Writing Skills Coach",
    description: "Empower students to express themselves effectively through enhanced writing abilities.",
    responsibilities: [
      "Teach essay writing, letter writing, and creative writing",
      "Review and provide detailed feedback on written work",
      "Develop writing curriculum and exercises"
    ],
    requirements: [
      "Strong writing and editing skills",
      "Experience in teaching writing",
      "Attention to detail"
    ]
  },
  {
    title: "Corporate Communication Trainer",
    description: "Train professionals in effective workplace communication, presentations, and business English.",
    responsibilities: [
      "Conduct corporate training sessions",
      "Focus on email writing, presentations, and meetings",
      "Customize training based on corporate needs"
    ],
    requirements: [
      "Corporate training experience",
      "Understanding of business communication",
      "Professional demeanor"
    ]
  }
];

/* ---------------- PAGE ---------------- */

const Careers = () => {
  const [form, setForm] = useState<CareerFormData>({
    name: "",
    email: "",
    contact: "",
    role: "",
    experience: "",
    resumeLink: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "careerApplications"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      alert(
        "✅ Application submitted successfully!\n\nOur team will review your profile and contact you soon.\n\n📧 theconsistentacademy@gmail.com"
      );

      setForm({
        name: "",
        email: "",
        contact: "",
        role: "",
        experience: "",
        resumeLink: "",
        message: "",
      });
    } catch (error) {
      console.error("Career form error:", error);
      alert("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <div className="pt-28 pb-2">
        <div className="text-center max-w-6xl mx-auto">
          <AnimatedHeading>
            Join The <span className="text-gradient">Consistent</span> Academy
          </AnimatedHeading>

          <AnimatedText className="text-muted-foreground text-lg mt-4">
            We're always looking for passionate educators and mentors who believe
            in consistent growth and meaningful learning.
          </AnimatedText>
        </div>
      </div>

      {/* ROLES */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <TooltipProvider delayDuration={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {roleDetails.map((role) => (
                <Tooltip key={role.title}>
                  <TooltipTrigger asChild>
                    <div>
                      <NeumorphicCard 
                        className="text-center p-4 cursor-pointer transition-all duration-300 ease-out hover:scale-105"
                        onClick={() => {
                          setForm(prev => ({ ...prev, role: role.title }));
                          setTimeout(() => {
                            document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                      >
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Briefcase className="text-primary transition-all duration-300" size={20} />
                          <h3 className="font-semibold text-sm">{role.title}</h3>
                        </div>
                        
                        <p className="text-muted-foreground text-xs mt-2">
                          Part-time / Full-time
                        </p>
                      </NeumorphicCard>
                    </div>
                  </TooltipTrigger>
                  
                  <TooltipContent 
                    side="bottom" 
                    className="max-w-md p-4 bg-popover border border-border shadow-xl z-[100]"
                    sideOffset={10}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="pb-2 border-b border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="text-primary" size={18} />
                          <h3 className="text-sm font-bold text-gradient">{role.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">Part-time / Full-time</p>
                      </div>

                      {/* Description */}
                      <p className="text-xs leading-relaxed font-semibold">{role.description}</p>

                      {/* Responsibilities */}
                      <div className="space-y-1.5">
                        <h4 className="font-semibold text-primary text-xs flex items-center gap-1.5">
                          <span className="w-0.5 h-3 bg-primary rounded-full"></span>
                          Key Responsibilities
                        </h4>
                        <ul className="space-y-1 pl-2">
                          {role.responsibilities.map((item, idx) => (
                            <li key={idx} className="text-xs font-semibold flex items-start gap-1.5">
                              <span className="text-primary mt-0.5 text-[10px]">•</span>
                              <span className="flex-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Requirements */}
                      <div className="space-y-1.5">
                        <h4 className="font-semibold text-primary text-xs flex items-center gap-1.5">
                          <span className="w-0.5 h-3 bg-primary rounded-full"></span>
                          Requirements
                        </h4>
                        <ul className="space-y-1 pl-2">
                          {role.requirements.map((item, idx) => (
                            <li key={idx} className="text-xs font-semibold flex items-start gap-1.5">
                              <span className="text-primary mt-0.5 text-[10px]">•</span>
                              <span className="flex-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* FORM */}
      <div className="py-6">
        <div className="max-w-3xl mx-auto">
          <NeumorphicCard className="p-8">
            <div className="text-center mb-6">
              <AnimatedHeading className="text-primary">
                Apply Now
              </AnimatedHeading>
              <AnimatedText className="text-muted-foreground mt-2">
                Your application will be securely stored and reviewed by our
                team.
              </AnimatedText>

              <p className="mt-3 text-sm text-primary flex justify-center items-center gap-2">
                <Mail size={16} />
                theconsistentacademy@gmail.com
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="number"
                    name="contact"
                    required
                    value={form.contact}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
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
                  required
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                />
              </div>

              {/* Resume Link */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Resume Link(make sure the link is accessible)
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="url"
                    name="resumeLink"
                    required
                    placeholder="https://drive.google.com/..."
                    value={form.resumeLink}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your resume to Google Drive and paste the link here
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Brief Introduction
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-background shadow-neu-sm focus:outline-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 text-center">
                <NeumorphicButton type="submit" size="lg" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                  <ArrowRight size={18} />
                </NeumorphicButton>
              </div>
            </form>
          </NeumorphicCard>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;
