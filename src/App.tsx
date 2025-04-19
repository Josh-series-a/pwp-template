import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import PageLoader from "@/components/PageLoader";

import Index from "./pages/Index";
import Products from "./pages/Products";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Exercises from "./pages/Exercises";
import BookInsights from "./pages/BookInsights";
import BookSession from "./pages/BookSession";
import Profile from "./pages/Profile";
import PreloaderDemo from './pages/PreloaderDemo';
import Read from './pages/Read';
import Read2 from './pages/Read2';

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('/dashboard');
  
  return (
    <>
      <PageLoader />
      {!isDashboardRoute && <Header />}
      <Routes>
        {/* Non-Dashboard Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navigate to="/dashboard/overview" replace />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/*">
          <Route path="overview" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="exercises" element={
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          } />
          <Route path="book-insights" element={
            <ProtectedRoute>
              <BookInsights />
            </ProtectedRoute>
          } />
          <Route path="book-session" element={
            <ProtectedRoute>
              <BookSession />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="read" element={
            <ProtectedRoute>
              <Read />
            </ProtectedRoute>
          } />
          <Route path="read2" element={
            <ProtectedRoute>
              <Read2 />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Add PreloaderDemo route */}
        <Route path="/preloader-demo" element={<PreloaderDemo />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
