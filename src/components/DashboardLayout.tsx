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

const SidebarCollapseButton = () => {
  const {
    toggleSidebar,
    state
  } = useSidebar();
  const isCollapsed = state === 'collapsed';
  return <Button variant="ghost" size="sm" onClick={toggleSidebar} className="flex h-6 w-6 p-0 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
      {isCollapsed ? <ChevronRight className="h-4 w-4 stroke-[2.5px]" /> : <ChevronLeft className="h-4 w-4 stroke-[2.5px]" />}
    </Button>;
};

const SidebarLogo = () => {
  return <div className="flex items-center px-4 py-4 justify-between">
      
      <SidebarCollapseButton />
    </div>;
};

const SidebarSearch = () => {
  return <div className="flex justify-center px-3 py-2">
      
    </div>;
};

const SidebarProfile = () => {
  const {
    user
  } = useAuth();
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

const SidebarNavigationHeader = () => {
  const {
    toggleSidebar,
    state
  } = useSidebar();
  const isCollapsed = state === 'collapsed';
  return <div className="flex items-center justify-between px-4 py-2">
      
      <Button variant="ghost" size="sm" onClick={toggleSidebar} className="flex h-6 w-6 p-0 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
        {isCollapsed ? <ChevronRight className="h-4 w-4 stroke-[2.5px]" /> : <ChevronLeft className="h-4 w-4 stroke-[2.5px]" />}
      </Button>
    </div>;
};

const SidebarNavigation = () => {
  const location = useLocation();
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard/overview',
      icon: Home
    }, 
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: FileText
    }, 
    {
      name: 'Book Insights',
      href: '/dashboard/book-insights',
      icon: BookOpen,
      disabled: true
    }, 
    {
      name: 'Exercises',
      href: '/dashboard/exercises',
      icon: Dumbbell,
      disabled: true
    }, 
    {
      name: 'Book a Session',
      href: '/dashboard/book-session',
      icon: Calendar,
      disabled: true
    }
  ];
  return <SidebarGroup className="py-[60px]">
      <SidebarNavigationHeader />
      <SidebarGroupContent className="px-2 mt-1">
        <SidebarMenu>
          {navigation.map(item => {
          const isActive = location.pathname === item.href;
          return <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive} 
                  tooltip={item.name} 
                  className={cn(
                    "my-1.5 transition-all duration-200 rounded-md", 
                    isActive ? "bg-primary/10 font-medium" : "hover:bg-primary/5",
                    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                  aria-disabled={item.disabled}
                >
                  <Link to={item.disabled ? "#" : item.href}>
                    <item.icon className={cn("transition-all duration-200 stroke-[2.5px]", isActive ? "text-primary" : "text-sidebar-foreground/80")} />
                    <span className={cn("transition-all duration-200 ml-3 font-medium", isActive ? "text-primary font-semibold" : "text-sidebar-foreground/90 font-medium")}>
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>;
        })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title
}) => {
  return <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex flex-col w-full">
        <DashboardHeader />
        
        <div className="flex flex-1 pt-14">
          <Sidebar collapsible="icon" className="z-30 shadow-sm border-r border-sidebar-border/30" style={{
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "3.5rem"
        } as React.CSSProperties}>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-[90px] md:px-[40px]">
              <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>;
};

export default DashboardLayout;
