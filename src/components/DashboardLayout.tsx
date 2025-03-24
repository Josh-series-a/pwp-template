import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';
import { Home, FileText, BookOpen, Dumbbell, Calendar, User, ChevronLeft, ChevronRight, Search, Bell } from 'lucide-react';
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
  const {
    open,
    toggleSidebar
  } = useSidebar();
  return <Button variant="ghost" size="sm" className="ml-auto flex h-8 w-8 p-0 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200" onClick={toggleSidebar}>
      {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>;
};

// Logo component that adapts to sidebar state
const SidebarLogo = () => {
  const {
    open
  } = useSidebar();
  return <div className={cn("flex items-center px-4 py-4", open ? "justify-between" : "justify-center")}>
      <Link to="/" className="flex items-center gap-2">
        <img src="/lovable-uploads/e47f8e5e-394f-454a-a8b5-8abf5cc18daa.png" alt="Logo" className="h-8 w-8 object-contain" />
        {open && <span className="font-semibold text-sidebar-foreground">Prosper</span>}
      </Link>
      {open && <SidebarCollapseButton />}
    </div>;
};

// Search component that adapts to sidebar state
const SidebarSearch = () => {
  const {
    open
  } = useSidebar();
  if (!open) {
    return <div className="flex justify-center px-3 py-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
          <Search className="h-5 w-5" />
        </Button>
      </div>;
  }
  return;
};

// User profile component at bottom of sidebar
const SidebarProfile = () => {
  const {
    user
  } = useAuth();
  const {
    open
  } = useSidebar();
  const userName = user?.user_metadata?.name || 'User';
  const userInitials = user?.user_metadata?.name ? userName.split(' ').map(part => part[0]).join('').toUpperCase() : 'U';
  return <div className={cn("px-4 py-3 mt-auto border-t border-sidebar-border/30", open ? "flex items-center" : "flex justify-center")}>
      <Link to="/dashboard/profile" className={cn("flex items-center", open ? "space-x-3" : "justify-center")}>
        <Avatar className="h-8 w-8 ring-2 ring-sidebar-accent/50">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        {open && <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">{userName}</span>
            <span className="text-xs text-sidebar-foreground/60">View profile</span>
          </div>}
      </Link>
    </div>;
};
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title
}) => {
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
  }, {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User
  }];
  return <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <DashboardHeader />
        
        <div className="flex flex-1 pt-14"> {/* Added padding-top to account for fixed header */}
          {/* Sidebar */}
          <Sidebar collapsible="icon" className="z-30 shadow-sm border-r border-sidebar-border/30">
            <SidebarContent className="flex flex-col h-full justify-between">
              {/* Top section */}
              <div>
                <SidebarLogo />
                <SidebarSearch />
                
                <SidebarGroup>
                  <SidebarGroupContent className="px-2 mt-2">
                    <SidebarMenu>
                      {navigation.map(item => {
                      const isActive = location.pathname === item.href;
                      return <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild isActive={isActive} tooltip={item.name} className={cn("my-1.5 transition-all duration-200 rounded-md", isActive ? "bg-sidebar-accent/50 font-medium" : "hover:bg-sidebar-accent/30")}>
                              <Link to={item.href}>
                                <item.icon className={cn("transition-all duration-200", isActive ? "text-primary" : "text-sidebar-foreground/60")} />
                                <span className={cn("transition-all duration-200 ml-3", isActive ? "text-primary font-medium" : "text-sidebar-foreground/80")}>{item.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>;
                    })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
              
              {/* Bottom section with profile */}
              <SidebarProfile />
            </SidebarContent>
          </Sidebar>
          
          {/* Main Content */}
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
    </SidebarProvider>;
};
export default DashboardLayout;