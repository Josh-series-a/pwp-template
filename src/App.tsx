
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import StaticHeader from "@/components/StaticHeader";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import PageLoader from "@/components/PageLoader";
import "./App.css";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Account = lazy(() => import("./pages/Account"));
const Chat = lazy(() => import("./pages/Chat"));
const Reports = lazy(() => import("./pages/Reports"));
const ReportDetail = lazy(() => import("./pages/ReportDetail"));
const Exercises = lazy(() => import("./pages/Exercises"));
const Read = lazy(() => import("./pages/Read"));
const BookSession = lazy(() => import("./pages/BookSession"));
const BookInsights = lazy(() => import("./pages/BookInsights"));
const PackageDetail = lazy(() => import("./pages/PackageDetail"));
const DocumentPreview = lazy(() => import("./pages/DocumentPreview"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminCredits = lazy(() => import("./pages/AdminCredits"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <StaticHeader />
              <main className="pt-16">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports/:id" element={
                      <ProtectedRoute>
                        <ReportDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/exercises" element={
                      <ProtectedRoute>
                        <Exercises />
                      </ProtectedRoute>
                    } />
                    <Route path="/read" element={
                      <ProtectedRoute>
                        <Read />
                      </ProtectedRoute>
                    } />
                    <Route path="/book/:sessionId" element={
                      <ProtectedRoute>
                        <BookSession />
                      </ProtectedRoute>
                    } />
                    <Route path="/book-insights/:sessionId" element={
                      <ProtectedRoute>
                        <BookInsights />
                      </ProtectedRoute>
                    } />
                    <Route path="/packages/:id" element={
                      <ProtectedRoute>
                        <PackageDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/documents/:id" element={
                      <ProtectedRoute>
                        <DocumentPreview />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin" element={
                      <RoleProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <RoleProtectedRoute requiredRole="admin">
                        <AdminUsers />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/admin/credits" element={
                      <RoleProtectedRoute requiredRole="admin">
                        <AdminCredits />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <RoleProtectedRoute requiredRole="admin">
                        <AdminAnalytics />
                      </RoleProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
