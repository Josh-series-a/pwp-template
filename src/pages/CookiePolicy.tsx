
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import TransitionWrapper from '@/components/TransitionWrapper';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <section className="pt-32 pb-16 px-6 md:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <TransitionWrapper animation="slide-up">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white">Cookie Policy</h1>
              <p className="text-xl text-gray-300">
                How we use cookies and similar technologies
              </p>
            </div>
          </TransitionWrapper>
        </div>
      </section>

      <section className="py-16 px-6 md:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <TransitionWrapper animation="slide-up">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device 
                    when you visit a website. They are widely used to make websites work more efficiently 
                    and to provide information to the site owners.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We use cookies for several purposes:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li><strong>Essential cookies:</strong> These are necessary for the website to function properly</li>
                    <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website</li>
                    <li><strong>Preference cookies:</strong> These remember your choices and preferences</li>
                    <li><strong>Marketing cookies:</strong> These are used to deliver relevant advertisements</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Session Cookies</h3>
                      <p className="text-gray-300">These are temporary cookies that expire when you close your browser.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Persistent Cookies</h3>
                      <p className="text-gray-300">These remain on your device for a set period or until you delete them.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Third-Party Cookies</h3>
                      <p className="text-gray-300">These are set by domains other than the one you are visiting.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Managing Your Cookies</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You can control and manage cookies in various ways:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Most browsers allow you to refuse cookies or delete certain cookies</li>
                    <li>You can set your browser to notify you when cookies are being used</li>
                    <li>You can opt out of certain third-party cookies through industry opt-out programs</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions about our use of cookies, please contact us through 
                    our website or email us directly.
                  </p>
                </div>

                <div className="pt-8 border-t border-white/20">
                  <p className="text-sm text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TransitionWrapper>

          <TransitionWrapper animation="slide-up" delay={200}>
            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-2xl px-8 py-4 text-lg font-semibold backdrop-blur-sm">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </TransitionWrapper>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
