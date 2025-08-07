
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import CreditsDisplay from './CreditsDisplay';
import HealthScoreCreditsDisplay from './HealthScoreCreditsDisplay';

const StaticHeader: React.FC = () => {
  const { toggleSidebar, state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';
  
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
    
    const items: Array<{ label: string; href: string; isActive?: boolean }> = [
      { label: 'All Components', href: '/dashboard' }
    ];
    
    if (segments.length > 1) {
      items.push({ label: 'Application', href: '/dashboard' });
      
      const currentSegment = segments[segments.length - 1];
      const currentLabel = routeMap[currentSegment] || currentSegment;
      items.push({ label: currentLabel, href: path, isActive: true });
    }
    
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
        <Button onClick={handleBuyCredits} variant="outline" size="sm" className="gap-2">
          <CreditCard className="h-4 w-4" />
          Buy Credits
        </Button>
      </div>
    </header>
  );
};

export default StaticHeader;
