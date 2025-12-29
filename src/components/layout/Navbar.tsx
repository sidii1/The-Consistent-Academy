import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  path?: string;
  sectionId?: string;
};

const navLinks: NavItem[] = [
  { name: "Home", sectionId: "home" },
  { name: "Founder", sectionId: "founder" },
  { name: "Courses", path: "/courses" },
  { name: "Careers", path: "/careers" },
  { name: "Testimonials", sectionId: "testimonials" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position (only on home page)
      if (location.pathname === "/") {
        const sections = ["home", "founder", "testimonials"];
        for (const sectionId of sections.reverse()) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (item: NavItem) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.sectionId) {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: item.sectionId } });
      } else {
        const element = document.getElementById(item.sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Handle scroll to section when navigating from another page
  useEffect(() => {
    if (location.state?.scrollTo && location.pathname === "/") {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const isActive = (item: NavItem) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.sectionId && location.pathname === "/") {
      return activeSection === item.sectionId;
    }
    return false;
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "py-3" : "py-5"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container mx-auto px-4">
          <motion.nav
            className={cn(
              "rounded-2xl px-6 py-4 transition-all duration-500",
              isScrolled
                ? "glass shadow-neu bg-gradient-to-r from-card/90 via-primary/5 to-card/90"
                : "bg-transparent"
            )}
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-neu flex items-center justify-center overflow-hidden"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="/logo.png" alt="The Consistent Academy" className="w-full h-full object-cover" />
                </motion.div>
                <span className="font-bold text-xl text-foreground hidden sm:block">
                  The Consistent Academy
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive(item)
                        ? "text-primary bg-gradient-to-r from-primary/15 to-accent/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>

              <div className="hidden lg:block">
                <Link to="/contact">
                  <NeumorphicButton variant="primary" size="sm">
                    Enroll Now
                  </NeumorphicButton>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2 rounded-xl shadow-neu-sm bg-gradient-to-br from-card to-primary/5"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              className="absolute top-24 left-4 right-4 bg-gradient-to-br from-card to-primary/5 rounded-3xl shadow-neu-lg p-6"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "block w-full text-left px-4 py-3 rounded-xl text-lg font-medium transition-all",
                        isActive(item)
                          ? "text-primary bg-gradient-to-r from-primary/15 to-accent/10"
                          : "text-foreground hover:bg-primary/10"
                      )}
                    >
                      {item.name}
                    </button>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4"
                >
                  <Link to="/contact">
                    <NeumorphicButton variant="primary" className="w-full">
                      Enroll Now
                    </NeumorphicButton>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};