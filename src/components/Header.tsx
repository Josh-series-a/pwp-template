
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="fixed w-full top-0 z-50 px-6 md:px-8 py-4 glass-card backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/06c251d7-7262-4d14-a348-1bf7cb1df32c.png" 
            alt="Prosper with Purpose Logo" 
            className="h-10 md:h-12"
          />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
          <NavLink to="/chat" current={location.pathname === "/chat"}>Analysis</NavLink>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/chat" 
            state={{ startAnalysis: true }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium",
              "bg-primary text-primary-foreground shadow-sm",
              "hover:bg-primary/90 smooth-transition"
            )}
          >
            Start Analysis
          </Link>
        </div>
      </div>
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

export default Header;
