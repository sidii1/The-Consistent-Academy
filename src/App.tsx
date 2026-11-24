import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";


import ScrollToTop from "@/components/ScrollToTop";
import RouteTracker from "@/components/RouteTracker";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SmoothScrolling } from "@/components/SmoothScrolling";

import Index from "./pages/Index";
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Tests = lazy(() => import("./pages/Tests"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AdminBlogs = lazy(() => import("./pages/AdminBlogs"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
import AdminRoute from "@/components/AdminRoute";
const ClubPage = lazy(() => import("./pages/club/ClubPage"));
const LeadershipBentoForwardProgram = lazy(() => import("./pages/LeadershipBentoForwardProgram"));
const Webinars = lazy(() => import("./pages/Webinars"));
const Game = lazy(() => import("./pages/Game"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/legal/ShippingPolicy"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen bg-neo-base" aria-busy="true" />}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
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
        <Route path="/lbfp" element={<LeadershipBentoForwardProgram />} />
        <Route path="/webinars" element={<Webinars />} />
        <Route path="/game" element={<Game />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <SmoothScrolling>
            {/* 🔥 This fixes the scroll bug */}
            <ScrollToTop />
            <RouteTracker />

            <AnimatedRoutes />
            <WhatsAppButton />
          </SmoothScrolling>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
