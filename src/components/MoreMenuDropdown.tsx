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
        <div className="absolute right-full top-0 mr-2 w-48 bg-popover border border-border rounded-xl shadow-lg z-50">
          {/* Content - 2 Grids */}
          <div className="p-3 space-y-4">
            {/* First Grid - More */}
            <div>
              <h3 className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide">More</h3>
              <div className="grid grid-cols-2 gap-1">
                {moreLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-accent transition-colors group text-center"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    <span className="text-xs font-medium leading-tight">{link.name}</span>
                    {link.external && (
                      <ExternalLink className="h-2 w-2 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Second Grid - Company */}
            <div>
              <h3 className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide">Company</h3>
              <div className="grid grid-cols-2 gap-1">
                {companyLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-accent transition-colors group text-center"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    <span className="text-xs font-medium leading-tight">{link.name}</span>
                    {link.external && (
                      <ExternalLink className="h-2 w-2 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
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