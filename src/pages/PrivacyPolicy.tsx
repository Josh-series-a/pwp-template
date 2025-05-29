
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import TransitionWrapper from '@/components/TransitionWrapper';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <section className="pt-32 pb-16 px-6 md:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <TransitionWrapper animation="slide-up">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
              <p className="text-xl text-gray-300">
                How we collect, use, and protect your information
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
                  <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We collect information you provide directly to us, such as when you create an account, 
                    use our services, or communicate with us.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Personal information (name, email address, phone number)</li>
                    <li>Business information for analysis purposes</li>
                    <li>Usage data and analytics</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Provide and improve our services</li>
                    <li>Generate personalized business reports</li>
                    <li>Communicate with you about our services</li>
                    <li>Ensure security and prevent fraud</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We implement appropriate security measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us through 
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

export default PrivacyPolicy;
