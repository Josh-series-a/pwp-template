
import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionWrapper from '@/components/TransitionWrapper';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <TransitionWrapper animation="slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Ready to transform your business? We'd love to hear from you and discuss how we can help you prosper with purpose.
            </p>
          </TransitionWrapper>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Contact Information */}
            <TransitionWrapper animation="slide-right">
              <div className="space-y-10">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Let's Start a Conversation</h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Whether you're looking for business guidance, want to discuss our services, or have questions about our approach, we're here to help.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="p-4 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600/30 transition-all duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2 text-lg">Email Us</h3>
                      <p className="text-gray-300">hello@prosperwithpurpose.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="p-4 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30 group-hover:bg-green-600/30 transition-all duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2 text-lg">Call Us</h3>
                      <p className="text-gray-300">+44 (0) 123 456 7890</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="p-4 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 group-hover:bg-purple-600/30 transition-all duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2 text-lg">Visit Us</h3>
                      <p className="text-gray-300">
                        London, United Kingdom<br />
                        Available for consultations worldwide
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 backdrop-blur-sm">
                  <h3 className="font-semibold text-white mb-3 text-lg">Response Time</h3>
                  <p className="text-gray-300">
                    We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </TransitionWrapper>

            {/* Contact Form */}
            <TransitionWrapper animation="slide-left" delay={200}>
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-900">Send us a Message</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</Label>
                        <Input id="firstName" placeholder="John" required className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                      <Input id="email" type="email" placeholder="john@company.com" required className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-slate-700">Company (Optional)</Label>
                      <Input id="company" placeholder="Your Company Name" className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</Label>
                      <Input id="subject" placeholder="How can we help you?" required className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-slate-700">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us more about your business and what you're looking to achieve..."
                        rows={6}
                        required
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TransitionWrapper>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-8 bg-slate-900">
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Take our free business health check and discover opportunities for growth.
            </p>
            <Button asChild size="lg" className="bg-yellow-400 text-slate-900 hover:bg-yellow-300 rounded-full px-8 py-6 text-lg font-semibold">
              <a href="/chat">Start Your Free Analysis</a>
            </Button>
          </div>
        </TransitionWrapper>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
