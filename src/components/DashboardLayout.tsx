
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
};

// Custom collapse button component for the top of the sidebar
const SidebarCollapseButton = () => {
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="ml-auto flex h-7 w-7 p-0 items-center justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      onClick={toggleSidebar}
    >
      {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
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
        <DashboardHeader />
        
        <div className="flex flex-1 pt-14"> {/* Added padding-top to account for fixed header */}
          {/* Sidebar */}
          <Sidebar collapsible="icon" className="z-30">
            <SidebarContent>
              <SidebarGroup>
                <div className="flex items-center px-3 pt-3 pb-2">
                  <SidebarGroupLabel className="text-sm font-semibold text-sidebar-foreground">Navigation</SidebarGroupLabel>
                  <SidebarCollapseButton />
                </div>
                <SidebarGroupContent className="mt-1">
                  <SidebarMenu>
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                            tooltip={item.name}
                            className={cn(
                              "my-1 transition-all duration-200",
                              isActive && "font-medium"
                            )}
                          >
                            <Link to={item.href}>
                              <item.icon className={cn(
                                "transition-all duration-200",
                                isActive ? "text-primary" : "text-sidebar-foreground/70"
                              )} />
                              <span className={cn(
                                "transition-all duration-200 ml-2",
                                isActive ? "text-primary" : "text-sidebar-foreground/80"
                              )}>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          
          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
              <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
