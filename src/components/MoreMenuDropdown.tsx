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
          className="fixed inset-0 z-40" 
          onClick={onClose}
        />
      )}
      
      {/* More Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-full top-0 ml-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">More</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-2 space-y-3 max-h-80 overflow-y-auto">
            {/* First Grid - More */}
            <div>
              <h3 className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide px-2">More</h3>
              <div className="space-y-0.5">
                {moreLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent transition-colors group text-sm"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    <span>{link.name}</span>
                    {link.external && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Second Grid - Company */}
            <div>
              <h3 className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide px-2">Company</h3>
              <div className="space-y-0.5">
                {companyLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent transition-colors group text-sm"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    <span>{link.name}</span>
                    {link.external && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreMenuDropdown;