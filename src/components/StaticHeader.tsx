
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Menu, Users, HelpCircle, Globe, Palette, Code, Crown, Settings, LogOut } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CreditsDisplay from './CreditsDisplay';
import HealthScoreCreditsDisplay from './HealthScoreCreditsDisplay';

const StaticHeader: React.FC = () => {
  const { toggleSidebar, state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isCollapsed = state === 'collapsed';
  
  const userName = user?.user_metadata?.name || 'Josh O\'Shea';
  const userEmail = user?.email || 'josh@series-a.co.uk';
  const userInitials = user?.user_metadata?.name ? userName.split(' ').map(part => part[0]).join('').toUpperCase() : 'JO';
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been logged out.");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.success("You have been logged out.");
      navigate('/');
    }
  };
  
  // Generate breadcrumb items based on current route
  const getBreadcrumbItems = (): Array<{ label: string; href: string; isActive?: boolean }> => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const routeMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'reports': 'Reports',
      'insights': 'Book Insights',
      'read': 'Read',
      'exercises': 'Exercises',
      'labs': 'Labs',
      'book-session': 'Book a Session',
      'account': 'Account',
    };
    
    const items: Array<{ label: string; href: string; isActive?: boolean }> = [];
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeMap[segment] || segment;
      const isActive = index === segments.length - 1;
      
      items.push({ 
        label, 
        href: currentPath, 
        isActive 
      });
    });
    
    return items;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  const handleBuyCredits = () => {
    // TODO: Implement buy credits functionality
    console.log('Buy credits clicked');
  };

  return (
    <header className={`fixed top-0 right-0 z-40 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between px-6 transition-all duration-200 ${isCollapsed ? 'left-0 lg:left-[5rem]' : 'left-0 lg:left-[16rem]'}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="flex items-center justify-center h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.href}>
                <BreadcrumbItem>
                  {item.isActive ? (
                    <BreadcrumbPage className="text-foreground font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <CreditsDisplay />
        <HealthScoreCreditsDisplay />
        <button onClick={handleBuyCredits} className="text-yellow-600 hover:text-yellow-700 transition-colors text-sm font-medium">
          Buy Credits
        </button>
        
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors duration-200">
              <Avatar className="h-8 w-8 ring-2 ring-accent/30">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User Info Header */}
            <div className="flex items-center gap-3 p-3 pb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            {/* Plan Actions */}
            <DropdownMenuItem className="cursor-pointer">
              <Crown className="mr-2 h-4 w-4" />
              Get a plan
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              Add members
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Subscription Info */}
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Subscription
            </DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer justify-between">
              <span>Free</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Settings */}
            <DropdownMenuItem asChild>
              <Link to="/account" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Account
              </Link>
            </DropdownMenuItem>
            
            {/* Language Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe className="mr-2 h-4 w-4" />
                Language
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="cursor-pointer justify-between">
                  <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Spanish</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>French</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            {/* Theme Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="cursor-pointer justify-between">
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuItem className="cursor-pointer">
              <Code className="mr-2 h-4 w-4" />
              Use AI code
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Help */}
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help center
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Sign Out */}
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default StaticHeader;
