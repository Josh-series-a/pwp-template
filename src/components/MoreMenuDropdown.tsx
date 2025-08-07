import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MoreMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreMenuDropdown: React.FC<MoreMenuDropdownProps> = ({ isOpen, onClose }) => {
  const quickLinks = [
    { name: 'Home', href: '/', external: false },
    { name: 'About Us', href: '/about', external: false },
    { name: 'Products', href: '/products', external: false },
    { name: 'Contact', href: '/contact', external: false },
  ];

  const resourceLinks = [
    { name: 'Exercises', href: '/dashboard/exercises', external: false },
    { name: 'Reports', href: '/dashboard/reports', external: false },
    { name: 'Help Center', href: '/help', external: false },
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
        <div className="fixed left-64 bottom-20 w-72 bg-popover border border-border rounded-xl shadow-lg z-50">
          {/* Content - 2 Grids */}
          <div className="p-3">
            <div className="grid grid-cols-2 gap-4">
              {/* Quick Links Section - Left */}
              <div>
                <h3 className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide">Quick Links</h3>
                <div className="border-t border-border pt-2">
                  <div className="space-y-1">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="block text-xs text-foreground hover:text-primary transition-colors"
                        onClick={onClose}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resources Section - Right */}
              <div>
                <h3 className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide">Resources</h3>
                <div className="border-t border-border pt-2">
                  <div className="space-y-1">
                    {resourceLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="block text-xs text-foreground hover:text-primary transition-colors"
                        onClick={onClose}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreMenuDropdown;