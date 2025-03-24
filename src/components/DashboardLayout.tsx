
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Dumbbell, 
  Calendar, 
  User
} from 'lucide-react';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard/overview', icon: Home },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Exercises', href: '/dashboard/exercises', icon: Dumbbell },
    { name: 'Book Insights', href: '/dashboard/book-insights', icon: BookOpen },
    { name: 'Book a Session', href: '/dashboard/book-session', icon: Calendar },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col fixed h-full bg-card shadow-sm border-r pt-8">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = window.location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
