import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoreMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreMenuDropdown: React.FC<MoreMenuDropdownProps> = ({ isOpen, onClose }) => {
  const moreLinks = [
    { name: 'API for Developers', href: '#', external: true },
    { name: 'Android', href: '#', external: true },
    { name: 'iOS', href: '#', external: true },
    { name: 'Sell content', href: '#', external: true },
    { name: 'Company', href: '#', external: true },
  ];

  const companyLinks = [
    { name: 'About us', href: '#', external: true },
    { name: 'Pricing', href: '#', external: true },
    { name: 'AI Partners Program', href: '#', external: true },
    { name: 'Events', href: '#', external: true },
    { name: 'Blog', href: '#', external: true },
    { name: 'Terms of use', href: '#', external: true },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={onClose}
        />
      )}
      
      {/* More Menu Dropdown */}
      <div className={`fixed left-0 top-0 h-screen w-80 bg-background border-r border-border shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-64' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">More</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* First Grid - More */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">More</h3>
            <div className="space-y-1">
              {moreLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  <span className="text-sm font-medium">{link.name}</span>
                  {link.external && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Second Grid - Company */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">Company</h3>
            <div className="space-y-1">
              {companyLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  <span className="text-sm font-medium">{link.name}</span>
                  {link.external && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreMenuDropdown;