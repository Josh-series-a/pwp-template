
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import TransitionWrapper from '@/components/TransitionWrapper';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <section className="pt-32 pb-16 px-6 md:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <TransitionWrapper animation="slide-up">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
              <p className="text-xl text-gray-300">
                Agreement between you and Prosper with Purpose
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
                  <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
                  <p className="text-gray-300 leading-relaxed">
                    By accessing and using this website, you accept and agree to be bound by the 
                    terms and provision of this agreement.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Permission is granted to temporarily download one copy of the materials 
                    on Prosper with Purpose's website for personal, non-commercial transitory viewing only.
                  </p>
                  <p className="text-gray-300 leading-relaxed">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We strive to provide uninterrupted access to our services, but we do not guarantee 
                    that our services will be available at all times.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                  <p className="text-gray-300 leading-relaxed">
                    In no event shall Prosper with Purpose or its suppliers be liable for any damages 
                    arising out of the use or inability to use the materials on our website.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
                  <p className="text-gray-300 leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with 
                    the laws and you irrevocably submit to the exclusive jurisdiction of the courts.
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

export default TermsOfService;
