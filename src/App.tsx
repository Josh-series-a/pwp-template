import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import TransitionWrapper from "./components/TransitionWrapper";
import ScrollToTop from "./components/ScrollToTop";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminSignup from "./pages/AdminSignup";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import PackageDetail from "./pages/PackageDetail";
import PackageDocuments from "./pages/PackageDocuments";
import DocumentPreview from "./pages/DocumentPreview";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCredits from "./pages/AdminCredits";
import AdminAnalytics from "./pages/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <TransitionWrapper>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              
              {/* User Dashboard Routes - Only for regular users */}
              <Route path="/dashboard" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Dashboard />
                </RoleProtectedRoute>
              } />
              
              {/* Account route - accessible to both users and admins */}
              <Route path="/account" element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/reports" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <Reports />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports/:companySlug/:reportId" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <ReportDetail />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports/:companySlug/:reportId/:packageId" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <PackageDetail />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports/:companySlug/:reportId/documents/:packageName" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <PackageDocuments />
                </RoleProtectedRoute>
              } />
              <Route path="/dashboard/reports/:companySlug/:reportId/:packageId/preview" element={
                <RoleProtectedRoute allowedRoles={['User']} redirectTo="/admin/dashboard">
                  <DocumentPreview />
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
              <Route path="/admin/credits" element={
                <RoleProtectedRoute allowedRoles={['Admin']} redirectTo="/dashboard">
                  <AdminCredits />
                </RoleProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <RoleProtectedRoute allowedRoles={['Admin']} redirectTo="/dashboard">
                  <AdminAnalytics />
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
