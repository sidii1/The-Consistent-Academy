import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const footerLinks = {
    pages: [
      { name: "Home", onClick: () => scrollToSection("home") },
      { name: "About Us", onClick: () => scrollToSection("about") },
      { name: "Courses", path: "/courses" },
      { name: "Testimonials", onClick: () => scrollToSection("testimonials") },
    ],
    courses: [
      { name: "IELTS Preparation", path: "/courses" },
      { name: "Spoken English", path: "/courses" },
      { name: "Writing Skills", path: "/courses" },
      { name: "Grammar Mastery", path: "/courses" },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-card via-primary/5 to-primary/10 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Purple accent blobs */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-neu flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="The Consistent Academy" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg text-foreground">
                The Consistent Academy
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Empowering learners to achieve English fluency through consistent practice and expert guidance.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 shadow-neu-sm flex items-center justify-center text-primary hover:text-accent transition-colors"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.pages.map((link, index) => (
                <li key={index}>
                  {link.path ? (
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      onClick={link.onClick}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-foreground mb-6">Our Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold text-foreground mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Pune,Maharashtra</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span>+91 77091 09830</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span>theconsistentacademy@gmail.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          className="mt-16 pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} The Consistent Academy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};