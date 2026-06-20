import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";


import ScrollToTop from "@/components/ScrollToTop";
import { SmoothScrolling } from "@/components/SmoothScrolling";

import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact"; 
import Tests from "./pages/Tests";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlogs from "./pages/AdminBlogs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "@/components/AdminRoute";
import ClubPage from "./pages/club/ClubPage";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route
          path="/admin/blogs"
          element={
            <AdminRoute>
              <AdminBlogs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        {/* CC Club — standalone, no navbar, self-managed auth gate */}
        <Route path="/club" element={<ClubPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <SmoothScrolling>
          {/* 🔥 This fixes the scroll bug */}
          <ScrollToTop />

          <AnimatedRoutes />
        </SmoothScrolling>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
