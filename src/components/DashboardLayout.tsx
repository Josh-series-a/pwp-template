
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';
import { Home, FileText, BookOpen, Dumbbell, Calendar, ChevronLeft, ChevronRight, Search, Bell } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
};

// Custom collapse button component for the top of the sidebar
const SidebarCollapseButton = () => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleSidebar}
      className="ml-auto flex h-8 w-8 p-0 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

// Logo component that adapts to sidebar state
const SidebarLogo = () => {
  return <div className="flex items-center px-4 py-4 justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src="/lovable-uploads/e47f8e5e-394f-454a-a8b5-8abf5cc18daa.png" alt="Logo" className="h-8 w-8 object-contain" />
        <span className="font-semibold text-sidebar-foreground">Prosper</span>
      </Link>
      <SidebarCollapseButton />
    </div>;
};

// Search component that adapts to sidebar state
const SidebarSearch = () => {
  return <div className="flex justify-center px-3 py-2">
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
        <Search className="h-5 w-5" />
      </Button>
    </div>;
};

// User profile component at bottom of sidebar
const SidebarProfile = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || 'User';
  const userInitials = user?.user_metadata?.name ? userName.split(' ').map(part => part[0]).join('').toUpperCase() : 'U';
  
  return <div className="px-4 py-3 mt-auto border-t border-sidebar-border/30 flex items-center">
      <Link to="/dashboard/profile" className="flex items-center space-x-3">
        <Avatar className="h-8 w-8 ring-2 ring-sidebar-accent/50">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-sidebar-foreground">{userName}</span>
          <span className="text-xs text-sidebar-foreground/60">View profile</span>
        </div>
      </Link>
    </div>;
};

// Nav section header with collapse button
const SidebarNavigationHeader = () => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <span className="font-medium text-sm text-sidebar-foreground/70">Navigation</span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleSidebar}
        className="flex h-6 w-6 p-0 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

// Main navigation content component
const SidebarNavigation = () => {
  const location = useLocation();
  const navigation = [{
    name: 'Dashboard',
    href: '/dashboard/overview',
    icon: Home
  }, {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText
  }, {
    name: 'Exercises',
    href: '/dashboard/exercises',
    icon: Dumbbell
  }, {
    name: 'Book Insights',
    href: '/dashboard/book-insights',
    icon: BookOpen
  }, {
    name: 'Book a Session',
    href: '/dashboard/book-session',
    icon: Calendar
  }];

  return (
    <SidebarGroup>
      <SidebarNavigationHeader />
      <SidebarGroupContent className="px-2 mt-1">
        <SidebarMenu>
          {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.name} className={cn("my-1.5 transition-all duration-200 rounded-md", isActive ? "bg-sidebar-accent/50 font-medium" : "hover:bg-sidebar-accent/30")}>
                  <Link to={item.href}>
                    <item.icon className={cn("transition-all duration-200", isActive ? "text-primary" : "text-sidebar-foreground/60")} />
                    <span className={cn("transition-all duration-200 ml-3", isActive ? "text-primary font-medium" : "text-sidebar-foreground/80")}>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title
}) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <DashboardHeader />
        
        <div className="flex flex-1 pt-14">
          <Sidebar collapsible="icon" className="z-30 shadow-sm border-r border-sidebar-border/30">
            <SidebarContent className="flex flex-col h-full justify-between">
              <div>
                <SidebarLogo />
                <SidebarSearch />
                <SidebarNavigation />
              </div>
              <SidebarProfile />
            </SidebarContent>
          </Sidebar>
          
          <main className="flex-1 bg-background/50">
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
