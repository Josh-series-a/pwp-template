import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  return <Button 
    variant="ghost" 
    size="sm" 
    onClick={toggleSidebar} 
    className="flex h-8 w-8 p-0 items-center justify-center rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
  >
    {isCollapsed ? <ChevronRight className="h-4 w-4 stroke-[2.5px]" /> : <ChevronLeft className="h-4 w-4 stroke-[2.5px]" />}
  </Button>;
};

const SidebarLogo = () => {
  return <div className="flex items-center justify-between px-3 py-6 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:justify-between group-data-[collapsible=icon]:relative">
    <div className="flex items-center space-x-3 group-data-[collapsible=icon]:space-x-0 group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:-translate-x-1/2">
      <img 
        src="/lovable-uploads/PWP.svg" 
        alt="PWP Logo" 
        className="h-10 w-10 rounded-lg flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
      />
      <span className="font-semibold text-base text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        Prosper<br />With Purpose
      </span>
    </div>
    <div className="group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:top-1/2 group-data-[collapsible=icon]:-translate-y-1/2">
      <SidebarCollapseButton />
    </div>
  </div>;
};

const SidebarProfile = () => {
  const {
    user
  } = useAuth();
  const userName = user?.user_metadata?.name || 'User';
  const userInitials = user?.user_metadata?.name ? userName.split(' ').map(part => part[0]).join('').toUpperCase() : 'U';
  return <div className="px-4 py-4 mt-auto border-t border-sidebar-border/40">
    <Link to="/dashboard/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-200">
      <Avatar className="h-9 w-9 ring-2 ring-sidebar-accent/30">
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-medium text-sidebar-foreground">{userName}</span>
        <span className="text-xs text-sidebar-foreground/60">View profile</span>
      </div>
    </Link>
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
  return <div className="flex-1 px-4">
    <div className="space-y-1">
      {navigation.map(item => {
        const isActive = location.pathname === item.href;
        return <div key={item.name}>
          <Link 
            to={item.disabled ? "#" : item.href}
            className={cn(
              "w-full h-12 px-3 py-3 transition-all duration-200 rounded-lg flex items-center space-x-3 block",
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm font-medium" 
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80",
              item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
            aria-disabled={item.disabled}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors duration-200 stroke-[2.5px] flex-shrink-0", 
              isActive ? "text-primary-foreground" : "text-sidebar-foreground/70"
            )} />
            <span className={cn(
              "transition-colors duration-200 font-medium group-data-[collapsible=icon]:hidden text-base",
              isActive ? "text-primary-foreground" : "text-sidebar-foreground/90"
            )}>
              {item.name}
            </span>
          </Link>
        </div>;
      })}
    </div>
  </div>;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title
}) => {
  return <SidebarProvider defaultOpen={false}>
    <div className="min-h-screen flex flex-col w-full">        
      <div className="flex flex-1">
        <Sidebar 
          collapsible="icon" 
          className="z-30 shadow-lg border-r border-sidebar-border/50 bg-sidebar" 
          style={{
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "4rem"
          } as React.CSSProperties}
        >
          <SidebarContent className="flex flex-col h-full">
            <SidebarLogo />
            <SidebarNavigation />
            <SidebarProfile />
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 bg-background/50">
          <div className="w-full px-6 sm:px-8 py-8 md:px-12">
            <div className="flex items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>;
};

export default DashboardLayout;
