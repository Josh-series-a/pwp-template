
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 px-6 md:px-8 bg-slate-900 border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Prosper with Purpose</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Empowering businesses worldwide to achieve sustainable growth without burnout
            </p>
          </div>
          
          {/* Member Images */}
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/c0234353-eebf-43ea-b165-ff877c7f060c.png" 
                alt="FSB Member" 
                className="h-16 w-auto filter brightness-0 invert opacity-80 hover:opacity-100 transition-all duration-300"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/1a148eb6-0e62-40db-929b-b964ed70ae22.png" 
                alt="SRB Member" 
                className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Trusted by 10,000+ businesses worldwide</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
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
      </div>
    </footer>
  );
};

export default Footer;
