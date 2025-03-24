
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LogIn, LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/utils/authService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const result = await authService.signOut();
      
      if (result.success) {
        toast.success("You have been logged out.");
        navigate('/');
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header className="fixed w-full top-0 z-50 px-6 md:px-8 py-4 glass-card backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/e47f8e5e-394f-454a-a8b5-8abf5cc18daa.png" 
            alt="Prosper with Purpose Logo" 
            className="h-10 md:h-12"
          />
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
          <NavLink to="/products" current={location.pathname === "/products"}>Products</NavLink>
          <NavLink to="/chat" current={location.pathname === "/chat"}>Analysis</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" current={location.pathname === "/dashboard"}>
              Dashboard
            </NavLink>
          )}
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Authentication Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse bg-accent rounded-md"></div>
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.user_metadata?.name || 'User'}</span>
              </div>
              {location.pathname.startsWith('/dashboard') || 
               location.pathname.startsWith('/reports') || 
               location.pathname.startsWith('/exercises') || 
               location.pathname.startsWith('/book-insights') || 
               location.pathname.startsWith('/book-session') || 
               location.pathname.startsWith('/profile') ? (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="px-3 py-1 h-auto text-sm"
                >
                  <LayoutDashboard className="mr-2 h-3 w-3" />
                  Go to Website
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-1 h-auto text-sm"
                >
                  <LayoutDashboard className="mr-2 h-3 w-3" />
                  Dashboard
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="px-3 py-1 h-auto text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                ) : (
                  <LogOut className="mr-2 h-3 w-3" />
                )}
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="px-3 py-1 h-auto text-sm">
                  <LogIn className="mr-2 h-3 w-3" />
                  Login
                </Button>
              </Link>
              <Link 
                to="/signup"
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  "bg-primary text-primary-foreground shadow-sm",
                  "hover:bg-primary/90 smooth-transition"
                )}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md p-4 border-t border-border animate-slide-down">
          <nav className="flex flex-col space-y-4 mb-4">
            <MobileNavLink to="/" current={location.pathname === "/"} onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/products" current={location.pathname === "/products"} onClick={() => setIsMobileMenuOpen(false)}>Products</MobileNavLink>
            <MobileNavLink to="/chat" current={location.pathname === "/chat"} onClick={() => setIsMobileMenuOpen(false)}>Analysis</MobileNavLink>
            {isAuthenticated && (
              <MobileNavLink to="/dashboard" current={location.pathname === "/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
            )}
          </nav>
          
          <div className="flex flex-col space-y-3">
            {isLoading ? (
              <div className="h-10 w-full animate-pulse bg-accent rounded-md"></div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.user_metadata?.name || 'User'}</span>
                </div>
                {location.pathname.startsWith('/dashboard') || 
                 location.pathname.startsWith('/reports') || 
                 location.pathname.startsWith('/exercises') || 
                 location.pathname.startsWith('/book-insights') || 
                 location.pathname.startsWith('/book-session') || 
                 location.pathname.startsWith('/profile') ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Go to Website
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">
                    <User className="mr-2 h-4 w-4" />
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, current, children }: NavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "text-sm font-medium smooth-transition",
      current 
        ? "text-foreground" 
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, current, children, onClick }: MobileNavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "text-sm font-medium py-2 px-3 rounded-md w-full block",
      current 
        ? "bg-accent text-accent-foreground" 
        : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
    )}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;
