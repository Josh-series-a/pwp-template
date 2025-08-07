import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, FileText, BookOpen, Dumbbell, Calendar, ChevronLeft, ChevronRight, Search, Bell, Settings, LogOut, Book, TestTube } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/utils/authService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import StaticHeader from './StaticHeader';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
  hideHeader?: boolean;
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
  return <div className="flex items-center justify-between px-3 py-6 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:relative">
    <div className="flex items-center space-x-3 group-data-[collapsible=icon]:space-x-0">
      <img 
        src="/lovable-uploads/PWP.svg" 
        alt="PWP Logo" 
        className="h-10 w-10 rounded-lg flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
      />
      <span className="font-semibold text-base text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        Prosper<br />With Purpose
      </span>
    </div>
    <div className="group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:right-1 group-data-[collapsible=icon]:top-1/2 group-data-[collapsible=icon]:-translate-y-1/2">
      <SidebarCollapseButton />
    </div>
  </div>;
};

const SidebarProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const userName = user?.user_metadata?.name || 'User';
  const userInitials = user?.user_metadata?.name ? userName.split(' ').map(part => part[0]).join('').toUpperCase() : 'U';
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been logged out.");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, try to navigate away
      toast.success("You have been logged out.");
      navigate('/');
    }
  };
  
  return (
    <>
      {/* Upgrade Plan Card */}
      <div className="px-4 py-3 mb-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
          <h4 className="font-semibold text-sm text-foreground mb-1">Upgrade Plan</h4>
          <p className="text-xs text-muted-foreground mb-3">Unlock more features and capabilities</p>
          <button className="w-full bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
      
      <div className="px-4 py-4 mt-auto border-t border-sidebar-border/40">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-200 w-full text-left">
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
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/account" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

const SidebarNavigation = () => {
  const location = useLocation();
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home
    }, 
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: FileText
    }, 
    {
      name: 'Read',
      href: '/dashboard/read',
      icon: Book
    }, 
    {
      name: 'Book Insights',
      href: '/dashboard/insights',
      icon: BookOpen
    }, 
    {
      name: 'Exercises',
      href: '/dashboard/exercises',
      icon: Dumbbell
    }, 
    {
      name: 'Labs',
      href: '/dashboard/labs',
      icon: TestTube,
      hidden: true
    }, 
    {
      name: 'Book a Session',
      href: '/dashboard/book-session',
      icon: Calendar,
      disabled: true,
      hidden: true
    }
  ];
  return <div className="flex-1 px-4">
    <div className="space-y-1">
      {navigation.filter(item => !item.hidden).map(item => {
        const isActive = location.pathname === item.href;
        return <div key={item.name}>
          <Link 
            to={item.disabled ? "#" : item.href}
            className={cn(
              "w-full h-12 px-3 py-3 transition-all duration-200 rounded-lg flex items-center space-x-3",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0",
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
  title,
  hideHeader = false
}) => {
  return <SidebarProvider defaultOpen={true}>
    <div className="min-h-screen flex w-full overflow-hidden group">        
      <Sidebar 
        collapsible="icon" 
        className="fixed inset-y-0 left-0 z-30 shadow-lg border-r border-sidebar-border/50 bg-sidebar overflow-y-auto" 
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "5rem"
        } as React.CSSProperties}
      >
        <SidebarContent className="flex flex-col h-full">
          <SidebarLogo />
          <SidebarNavigation />
          <SidebarProfile />
        </SidebarContent>
      </Sidebar>
      
      <StaticHeader />
      
      <main className="flex-1 bg-background/50 transition-all duration-200 ease-linear ml-0 lg:ml-[5rem] lg:group-data-[state=expanded]:ml-[16rem] overflow-y-auto h-screen pt-16">
        <div className="w-full h-full flex flex-col mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {!hideHeader && (
            <div className="flex items-center justify-start py-4 sm:py-6 flex-shrink-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center">{title}</h1>
            </div>
          )}
          <div className={cn(
            "flex-1 pb-6 sm:pb-8 min-h-0",
            hideHeader && "pt-4 sm:pt-6"
          )}>
            {children}
          </div>
        </div>
      </main>
    </div>
  </SidebarProvider>;
};

export default DashboardLayout;
