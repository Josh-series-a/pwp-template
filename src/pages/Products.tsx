import React, { useState } from 'react';
import { Book, ArrowRight, CheckCircle, User, FileText, FileBox, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import TransitionWrapper from '@/components/TransitionWrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TalkToAuthorDialog from '@/components/TalkToAuthorDialog';

const Products = () => {
  const [isTalkToAuthorOpen, setIsTalkToAuthorOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Talk to Author Dialog */}
      <TalkToAuthorDialog 
        isOpen={isTalkToAuthorOpen}
        onClose={() => setIsTalkToAuthorOpen(false)}
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper animation="fade">
            <h1 className="text-center font-semibold tracking-tighter leading-tight mb-6">
              Explore Our Products
            </h1>
            <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Whether you're just starting your journey or already running a business, Prosper With Purpose offers the tools to help you reduce stress, gain clarity, and take control—with purpose.
            </p>
          </TransitionWrapper>
        </div>
      </section>
      
      {/* The Book Section */}
      <section className="py-16 px-6 md:px-8 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
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
                  <Book className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Prosper With Purpose – The Book</h2>
                </div>
                <h3 className="text-2xl font-medium">Your Essential Guide to a More Balanced and Successful Business Life</h3>
                <p className="text-muted-foreground">By Colin Crooks MBE</p>
                
                <p className="text-lg">
                  Learn the 3 Ps—Plan, People, Profits—and discover how to grow a sustainable, purpose-driven business that works for you, not the other way around.
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p>29 practical business exercises</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p>Real-world case studies</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p>Future-fit business model canvas</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p>Tools to reduce stress and make better decisions</p>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="rounded-full">
                    Buy the Book – £14.99
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full"
                    onClick={() => setIsTalkToAuthorOpen(true)}
                  >
                    <Headphones className="mr-2 h-4 w-4" />
                    Talk to the Author
                  </Button>
                  
                  <p className="text-sm text-muted-foreground mt-2">Available in paperback & Kindle</p>
                </div>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* AI Business Evaluation Section */}
      <section className="py-16 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <TransitionWrapper animation="slide-left" delay={100} className="md:w-2/5">
              <div className="glass-card p-6 rounded-xl border shadow-md max-w-sm mx-auto">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/lovable-uploads/e47f8e5e-394f-454a-a8b5-8abf5cc18daa.png" 
                    alt="Prosper with Purpose Logo" 
                    className="h-16"
                  />
                </div>
                <h4 className="text-xl font-medium text-center mb-4">Business Health Report</h4>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm">Executive summary tailored to your business</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm">1–2 completed exercises from the book</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm">Strategic insights based on your online presence</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm">Human-reviewed before delivery</p>
                  </div>
                </div>
                <div className="border-t pt-4 text-center">
                  <p className="text-lg font-bold">£99 <span className="text-xs font-normal text-muted-foreground">/ FREE beta trial</span></p>
                </div>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-right" delay={200} className="md:w-3/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">AI-Powered Business Evaluation</h2>
                </div>
                <h3 className="text-2xl font-medium">Prosper With Purpose: The Business Analysis Tool</h3>
                
                <p className="text-lg">
                  Transform the wisdom of the book into tailored insights for your business.
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p>We scrape your website and combine it with structured prompts from the book</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p>AI generates a personalised evaluation + practical recommendations</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p>You get a PDF/Google Doc that's ready to take action on</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/chat">
                      Run Your Business Health Check
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Perfect for startup founders, small business owners, and purpose-led entrepreneurs.
                  </p>
                </div>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* Add-Ons Section */}
      <section className="py-16 px-6 md:px-8 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-12">
              <h2 className="font-semibold tracking-tight mb-4">Suggested Add-Ons</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Take your business journey further with these premium options
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TransitionWrapper animation="slide-up" delay={100}>
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>1:1 Coaching Call</CardTitle>
                  <CardDescription>Get a 60-min debrief call with one of our Prosper Advisors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Ask questions, dive deeper into your report, and shape your next steps.</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  <p className="font-bold text-lg">£149</p>
                  <Button size="sm" className="w-full">Book Now</Button>
                </CardFooter>
              </Card>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={200}>
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <FileBox className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Full Workbook Bundle</CardTitle>
                  <CardDescription>Coming Soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Get editable templates, the Business Decision Tool, and access to all 29 exercises as fillable PDFs or Notion templates.</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  <p className="font-bold text-lg">Coming Soon</p>
                  <Button variant="outline" size="sm" className="w-full">Notify Me When Available</Button>
                </CardFooter>
              </Card>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={300}>
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>For Coaches & Advisors</CardTitle>
                  <CardDescription>Use our AI-powered reports to serve your clients better and faster</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p className="text-sm">White-label versions available</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p className="text-sm">Perfect for business mentors & accelerators</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Apply to Partner</Button>
                </CardFooter>
              </Card>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-8">
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-semibold tracking-tight">
              Start Your Journey
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whatever stage you're at, we'll meet you there—with automation, AI, and Colin's decades of hard-won business experience at your side.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-full">
                Buy the Book
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/chat">
                  Get the Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full"
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
      <footer className="py-8 px-6 md:px-8 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Prosper with Purpose. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
