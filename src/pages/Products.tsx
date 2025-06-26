import React, { useState } from 'react';
import { Book, ArrowRight, CheckCircle, User, FileText, FileBox, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionWrapper from '@/components/TransitionWrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TalkToAuthorDialog from '@/components/TalkToAuthorDialog';
import SubscriptionPlans from '@/components/SubscriptionPlans';

const Products = () => {
  const [isTalkToAuthorOpen, setIsTalkToAuthorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Talk to Author Dialog */}
      <TalkToAuthorDialog 
        isOpen={isTalkToAuthorOpen}
        onClose={() => setIsTalkToAuthorOpen(false)}
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper animation="fade">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-center">
              Explore Our Products
            </h1>
            <p className="text-center text-lg text-gray-300 max-w-3xl mx-auto mb-12">
              Whether you're just starting your journey or already running a business, Prosper With Purpose offers the tools to help you reduce stress, gain clarity, and take control—with purpose.
            </p>
          </TransitionWrapper>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-16 px-6 md:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SubscriptionPlans />
        </div>
      </section>
      
      {/* The Book Section */}
      <section className="py-16 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <TransitionWrapper animation="slide-right" delay={100} className="md:w-2/5">
              <div className="relative">
                <img 
                  src="/lovable-uploads/c84b7480-caf5-42d4-b90e-0507c12129e0.png" 
                  alt="Prosper with Purpose book cover" 
                  className="w-full max-w-sm mx-auto shadow-2xl rounded-lg"
                />
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-left" delay={200} className="md:w-3/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Prosper With Purpose – The Book</h2>
                </div>
                <h3 className="text-2xl md:text-3xl font-medium text-white">Your Essential Guide to a More Balanced and Successful Business Life</h3>
                <p className="text-gray-300">By Colin Crooks MBE</p>
                
                <p className="text-lg text-gray-300">
                  Learn the 3 Ps—Plan, People, Profits—and discover how to grow a sustainable, purpose-driven business that works for you, not the other way around.
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-1" />
                    <p className="text-gray-300">29 practical business exercises</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-1" />
                    <p className="text-gray-300">Real-world case studies</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-1" />
                    <p className="text-gray-300">Future-fit business model canvas</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-1" />
                    <p className="text-gray-300">Tools to reduce stress and make better decisions</p>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                    Buy the Book – £14.99
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 whitespace-nowrap"
                    onClick={() => setIsTalkToAuthorOpen(true)}
                  >
                    <Headphones className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Talk to the Author</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Available in paperback & Kindle</p>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* AI Business Evaluation Section */}
      <section className="py-16 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <TransitionWrapper animation="slide-left" delay={100} className="md:w-2/5">
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl max-w-sm mx-auto">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/lovable-uploads/e47f8e5e-394f-454a-a8b5-8abf5cc18daa.png" 
                    alt="Prosper with Purpose Logo" 
                    className="h-16"
                  />
                </div>
                <h4 className="text-xl font-medium text-center mb-4 text-white">Business Health Report</h4>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-1" />
                    <p className="text-sm text-gray-300">Executive summary tailored to your business</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-1" />
                    <p className="text-sm text-gray-300">1–2 completed exercises from the book</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-1" />
                    <p className="text-sm text-gray-300">Strategic insights based on your online presence</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-1" />
                    <p className="text-sm text-gray-300">Human-reviewed before delivery</p>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4 text-center">
                  <p className="text-lg font-bold text-white">£99 <span className="text-xs font-normal text-gray-400">/ FREE beta trial</span></p>
                </div>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-right" delay={200} className="md:w-3/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">AI-Powered Business Evaluation</h2>
                </div>
                <h3 className="text-2xl md:text-3xl font-medium text-white">Prosper With Purpose: The Business Analysis Tool</h3>
                
                <p className="text-lg text-gray-300">
                  Transform the wisdom of the book into tailored insights for your business.
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400 shrink-0 mt-1" />
                    <p className="text-gray-300">We scrape your website and combine it with structured prompts from the book</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400 shrink-0 mt-1" />
                    <p className="text-gray-300">AI generates a personalised evaluation + practical recommendations</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400 shrink-0 mt-1" />
                    <p className="text-gray-300">You get a PDF/Google Doc that's ready to take action on</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button asChild size="lg" className="rounded-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Link to="/chat">
                      Run Your Business Health Check
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    Perfect for startup founders, small business owners, and purpose-led entrepreneurs.
                  </p>
                </div>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* Add-Ons Section */}
      <section className="py-16 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <TransitionWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Suggested Add-Ons</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Take your business journey further with these premium options
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TransitionWrapper animation="slide-up" delay={100}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center mb-2">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">1:1 Coaching Call</CardTitle>
                  <CardDescription className="text-gray-300">Get a 60-min debrief call with one of our Prosper Advisors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Ask questions, dive deeper into your report, and shape your next steps.</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  <p className="font-bold text-lg text-white">£149</p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Book Now</Button>
                </CardFooter>
              </Card>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={200}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center mb-2">
                    <FileBox className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Full Workbook Bundle</CardTitle>
                  <CardDescription className="text-gray-300">Coming Soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Get editable templates, the Business Decision Tool, and access to all 29 exercises as fillable PDFs or Notion templates.</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  <p className="font-bold text-lg text-white">Coming Soon</p>
                  <Button variant="outline" size="sm" className="w-full border-white/30 text-white hover:bg-white/10">Notify Me When Available</Button>
                </CardFooter>
              </Card>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={300}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center mb-2">
                    <User className="h-5 w-5 text-green-400" />
                  </div>
                  <CardTitle className="text-white">For Coaches & Advisors</CardTitle>
                  <CardDescription className="text-gray-300">Use our AI-powered reports to serve your clients better and faster</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-1" />
                      <p className="text-sm text-gray-300">White-label versions available</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-1" />
                      <p className="text-sm text-gray-300">Perfect for business mentors & accelerators</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full border-white/30 text-white hover:bg-white/10">Apply to Partner</Button>
                </CardFooter>
              </Card>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-transparent to-blue-600/10"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Start Your Journey
            </h2>
            
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Whatever stage you're at, we'll meet you there—with automation, AI, and Colin's decades of hard-won business experience at your side.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                Buy the Book
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
                <Link to="/chat">
                  Get the Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsTalkToAuthorOpen(true)}
              >
                <Headphones className="mr-2 h-4 w-4" />
                Talk to the Author
              </Button>
            </div>
          </div>
        </TransitionWrapper>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Products;
