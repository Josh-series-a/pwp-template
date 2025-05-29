
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TransitionWrapper from "./components/TransitionWrapper";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import PackageDetail from "./pages/PackageDetail";
import Read from "./pages/Read";
import BookSession from "./pages/BookSession";
import BookInsights from "./pages/BookInsights";
import Products from "./pages/Products";
import Exercises from "./pages/Exercises";
import NotFound from "./pages/NotFound";
import PreloaderDemo from "./pages/PreloaderDemo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TransitionWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/preloader-demo" element={<PreloaderDemo />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/dashboard/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/dashboard/reports/:companySlug/:exerciseId/:reportId" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
              <Route path="/dashboard/reports/:companySlug/:exerciseId/:reportId/:packageId" element={<ProtectedRoute><PackageDetail /></ProtectedRoute>} />
              <Route path="/dashboard/read" element={<ProtectedRoute><Read /></ProtectedRoute>} />
              <Route path="/dashboard/read/:chapterId" element={<ProtectedRoute><BookSession /></ProtectedRoute>} />
              <Route path="/dashboard/insights" element={<ProtectedRoute><BookInsights /></ProtectedRoute>} />
              <Route path="/dashboard/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransitionWrapper>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
