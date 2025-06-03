
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import TransitionWrapper from "./components/TransitionWrapper";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminSignup from "./pages/AdminSignup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import PackageDetail from "./pages/PackageDetail";
import DocumentPreview from "./pages/DocumentPreview";
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
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";

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
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/preloader-demo" element={<PreloaderDemo />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              
              {/* User Dashboard Routes - Only for regular users */}
              <Route path="/dashboard" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Dashboard />
                </RoleProtectedRoute>
              } />
              <Route path="/profile" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Profile />
                </RoleProtectedRoute>
              } />
              <Route path="/account" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Account />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Reports />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports/:companySlug/:exerciseId/:reportId" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <ReportDetail />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports/:companySlug/:exerciseId/:reportId/:packageId" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <PackageDetail />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports/:companySlug/:exerciseId/:reportId/:packageId/preview" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <DocumentPreview />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/read" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Read />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/read/:chapterId" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <BookSession />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/insights" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <BookInsights />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/exercises" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Exercises />
                </RoleProtectedRoute>
              } />
              
              {/* Admin Routes - Only for admins */}
              <Route path="/admin/dashboard" element={
                <RoleProtectedRoute allowedRoles={['Admin']} redirectTo="/dashboard">
                  <AdminDashboard />
                </RoleProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <RoleProtectedRoute allowedRoles={['Admin']} redirectTo="/dashboard">
                  <AdminUsers />
                </RoleProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransitionWrapper>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
