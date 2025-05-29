
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 px-6 md:px-8 bg-slate-900 border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Prosper with Purpose</h3>
            <p className="text-gray-400 mb-6">
              Empowering businesses worldwide to achieve sustainable growth without burnout
            </p>
            
            {/* Member Images */}
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/lovable-uploads/c0234353-eebf-43ea-b165-ff877c7f060c.png" 
                alt="FSB Member" 
                className="h-12 w-auto filter brightness-0 invert opacity-80 hover:opacity-100 transition-all duration-300"
              />
              <img 
                src="/lovable-uploads/1a148eb6-0e62-40db-929b-b964ed70ae22.png" 
                alt="SRB Member" 
                className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-400 hover:text-white transition-colors duration-300">
                  AI Analysis
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/read" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Business Insights
                </Link>
              </li>
              <li>
                <Link to="/exercises" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Exercises
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/dashboard/reports" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Reports
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@prosperwithpurpose.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+44 (0) 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">London, UK</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white font-medium">Trusted by 10,000+ businesses worldwide</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="group">
              <div className="text-2xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Success Rate</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Countries</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Rating</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/terms-of-service" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/cookie-policy" className="hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Prosper with Purpose. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
