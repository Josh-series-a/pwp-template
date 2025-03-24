
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Dumbbell, 
  Calendar, 
  User,
  MenuIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard/overview', icon: Home },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Exercises', href: '/dashboard/exercises', icon: Dumbbell },
    { name: 'Book Insights', href: '/dashboard/book-insights', icon: BookOpen },
    { name: 'Book a Session', href: '/dashboard/book-session', icon: Calendar },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <DashboardHeader>
          <SidebarTrigger className="mr-2" />
        </DashboardHeader>
        
        <div className="flex flex-1 pt-14"> {/* Added padding-top to account for fixed header */}
          {/* Collapsible Sidebar */}
          <Sidebar>
            <SidebarContent className="pt-4">
              <SidebarMenu>
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild
                        tooltip={item.name}
                        isActive={isActive}
                      >
                        <Link to={item.href}>
                          <item.icon />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          
          {/* Main Content */}
          <main className="flex-1 md:pl-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
              <h1 className="text-2xl font-bold mb-6">{title}</h1>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
