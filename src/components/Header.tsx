
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LogIn, LogOut, User, Menu, X, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/utils/authService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const userName = user?.user_metadata?.name || 'User';
  const userInitials = user?.user_metadata?.name ? getInitials(user.user_metadata.name) : 'U';
  
  return (
    <header className={cn(
      "sticky w-full top-0 z-50 transition-all duration-300 ease-in-out bg-slate-900",
      "px-6 md:px-8 py-4"
    )}>
      <div className={cn(
        "max-w-6xl mx-auto rounded-2xl transition-all duration-300 ease-in-out px-6 py-3",
        "backdrop-blur-md border border-white/10",
        "bg-slate-900 shadow-xl border-white/20"
      )}>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/PWP.svg" 
              alt="Prosper with Purpose Logo" 
              className="h-8 md:h-10 w-8 md:w-10"
            />
            <div className="hidden sm:block">
              <span className={cn(
                "text-lg md:text-xl font-bold leading-tight transition-colors duration-300",
                "text-white"
              )}>
                Prosper<br />With Purpose
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" current={location.pathname === "/"} isScrolled={true}>Home</NavLink>
            <NavLink to="/about" current={location.pathname === "/about"} isScrolled={true}>About</NavLink>
            <NavLink to="/products" current={location.pathname === "/products"} isScrolled={true}>Products</NavLink>
            <NavLink to="/contact" current={location.pathname === "/contact"} isScrolled={true}>Contact</NavLink>
          </nav>
          
          <button 
            className="md:hidden text-white transition-colors duration-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-10 w-20 animate-pulse bg-white/20 rounded-full"></div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/10 border border-white/20 text-white">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-white/20 text-white text-xs">{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline">{userName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900/95 backdrop-blur-md border-white/20">
                  <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="cursor-pointer text-white hover:bg-white/10">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/overview" className="cursor-pointer text-white hover:bg-white/10">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-white hover:bg-white/10" disabled={isLoggingOut}>
                    {isLoggingOut ? (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50 text-white">
                    <LogIn className="mr-2 h-3 w-3" />
                    Login
                  </Button>
                </Link>
                <Link 
                  to="/contact"
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-yellow-400 text-slate-900 hover:bg-yellow-300 shadow-lg border-0 hover:scale-105"
                >
                  Schedule a Demo
                </Link>
              </>
            )}
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 rounded-xl p-4 backdrop-blur-md bg-slate-800/50">
            <nav className="flex flex-col space-y-4 mb-4">
              <MobileNavLink to="/" current={location.pathname === "/"} onClick={() => setIsMobileMenuOpen(false)} isScrolled={true}>Home</MobileNavLink>
              <MobileNavLink to="/about" current={location.pathname === "/about"} onClick={() => setIsMobileMenuOpen(false)} isScrolled={true}>About</MobileNavLink>
              <MobileNavLink to="/products" current={location.pathname === "/products"} onClick={() => setIsMobileMenuOpen(false)} isScrolled={true}>Products</MobileNavLink>
              <MobileNavLink to="/contact" current={location.pathname === "/contact"} onClick={() => setIsMobileMenuOpen(false)} isScrolled={true}>Contact</MobileNavLink>
            </nav>
            
            <div className="flex flex-col space-y-3">
              {isLoading ? (
                <div className="h-10 w-full animate-pulse bg-white/20 rounded-full"></div>
              ) : isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <User className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">{user?.user_metadata?.name || 'User'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      navigate('/dashboard/overview');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center rounded-full border border-white/30 text-white hover:bg-white/10"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center rounded-full border border-white/30 text-white hover:bg-white/10"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center rounded-full border border-white/30 text-white hover:bg-white/10">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-300">
                      <User className="mr-2 h-4 w-4" />
                      Schedule a Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
  isScrolled: boolean;
}

const NavLink = ({ to, current, children, isScrolled }: NavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full",
      "hover:bg-white/10",
      current 
        ? "bg-white/20 text-white" 
        : isScrolled ? "text-white/90 hover:text-white" : "text-white/80 hover:text-white"
    )}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, current, children, onClick, isScrolled }: MobileNavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "text-sm font-medium py-2 px-4 rounded-full w-full block transition-all duration-300",
      current 
        ? "bg-white/20 text-white" 
        : isScrolled ? "text-white/90 hover:bg-white/10 hover:text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
    )}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;
