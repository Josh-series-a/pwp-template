import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, FileText, Lightbulb, BarChart3, ArrowRight, CheckCircle, Users, PieChart, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import TransitionWrapper from '@/components/TransitionWrapper';
import FeatureCard from '@/components/FeatureCard';

const Index = () => {
  return <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="text-center md:text-left space-y-10 md:flex-1">
            <TransitionWrapper animation="fade">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-xs font-medium">Welcome to Prosper with Purpose</span>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-down" delay={100}>
              <h1 className="font-semibold tracking-tighter leading-tight mb-4">
                Build a Stronger Business—<br className="md:hidden" />With Less Stress
              </h1>
              <p className="text-xl text-muted-foreground mt-2">Guided by automation. Powered by purpose.</p>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={200}>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto md:mx-0 leading-relaxed">
                Turn insights from the book Prosper With Purpose into an AI-generated report tailored to your business—complete with personalised advice, strategic next steps, and a whole lot less stress.
              </p>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link to="/chat">
                    Get Your Free Business Health Check
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <a href="#how-it-works">Learn More</a>
                </Button>
              </div>
            </TransitionWrapper>
          </div>
          
          {/* Book Image */}
          <TransitionWrapper animation="fade" delay={400} className="md:flex-1">
            <div className="relative w-full max-w-lg mx-auto">
              <img 
                src="/lovable-uploads/c84b7480-caf5-42d4-b90e-0507c12129e0.png" 
                alt="Prosper with Purpose book" 
                className="w-full h-auto drop-shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </TransitionWrapper>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-6 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-secondary/20 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-20">
              <h2 className="font-semibold tracking-tight mb-6 text-4xl md:text-5xl">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Our AI-powered system combines your business data with the insights from Prosper With Purpose to create a tailored report just for you.
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TransitionWrapper animation="slide-up" delay={100}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl transition-all duration-300 group-hover:scale-105"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800/30 transition-all duration-300 group-hover:shadow-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-primary/20">
                    <span className="text-primary font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-medium mb-3">Share Your Business Info</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Fill in a short form with your name, company, and website. We'll pull all your online content using automation tools.
                  </p>
                </div>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={200}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl transition-all duration-300 group-hover:scale-105"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800/30 transition-all duration-300 group-hover:shadow-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-primary/20">
                    <span className="text-primary font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-medium mb-3">AI + Book + Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We combine insights from your site with the wisdom of Prosper With Purpose and our structured Fyva analysis to generate a custom report.
                  </p>
                </div>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={300}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl transition-all duration-300 group-hover:scale-105"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800/30 transition-all duration-300 group-hover:shadow-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-primary/20">
                    <span className="text-primary font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-medium mb-3">Get Your Personalised Report</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your final output: a tailored business evaluation, complete with practical next steps aligned to your mission, team, profits, and long-term goals.
                  </p>
                </div>
              </div>
            </TransitionWrapper>
          </div>
          
          <TransitionWrapper animation="fade" delay={400}>
            <div className="text-center mt-16 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 dark:border-gray-800/30 max-w-3xl mx-auto">
              <p className="text-lg italic leading-relaxed">
                👉 It's like having a business coach and a strategist in your inbox.
              </p>
            </div>
          </TransitionWrapper>
        </div>
      </section>
      
      {/* Book Details Section */}
      <section id="book-details" className="py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
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
                <h2 className="font-semibold tracking-tight">What's In The Book?</h2>
                <p className="text-lg">
                  Prosper With Purpose is your essential guide to building a successful business without burning out.
                  It focuses on the Three Ps:
                </p>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-start gap-4">
                    <Compass className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-medium">Plan</h3>
                      <p className="text-muted-foreground">Know where you're going and how to get there</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Users className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-medium">People</h3>
                      <p className="text-muted-foreground">Delegate well, build trust, grow strong teams</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <PieChart className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-medium">Profits</h3>
                      <p className="text-muted-foreground">Make money, manage cash, and stay in control</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg mt-6">
                  Now, we've turned that wisdom into a smart AI-powered tool to help you apply it—faster.
                </p>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* Report Details Section */}
      <section id="report-details" className="py-20 px-6 md:px-8 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="font-semibold tracking-tight mb-4">What You Get In Your Report</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Your personalized business analysis includes everything you need to move forward with clarity and purpose.
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard 
              icon={<FileText className="h-6 w-6" />} 
              title="Executive Summary" 
              description="An AI-powered analysis of your business based on your online presence" 
              delay={100} 
            />
            
            <FeatureCard 
              icon={<Lightbulb className="h-6 w-6" />} 
              title="Key Insights" 
              description="Valuable observations drawn from your website and the book's principles" 
              delay={200} 
            />
            
            <FeatureCard 
              icon={<Bot className="h-6 w-6" />} 
              title="Practical Exercises" 
              description="A breakdown of one or more exercises (e.g. 'Define Your Exit Strategy')" 
              delay={300} 
            />
            
            <FeatureCard 
              icon={<BarChart3 className="h-6 w-6" />} 
              title="Strategic Guidance" 
              description="Practical, no-fluff guidance that you can act on immediately" 
              delay={400} 
            />
          </div>
          
          <TransitionWrapper animation="fade" delay={500}>
            <div className="mt-16 flex justify-around flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Built by advisors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Powered by AdvisorPro.ai</span>
              </div>
            </div>
          </TransitionWrapper>
        </div>
      </section>
      
      {/* Who It's For Section */}
      <section id="who-its-for" className="py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="font-semibold tracking-tight mb-4">Who It's For</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our business health check is designed for people who are serious about growing their business with purpose.
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TransitionWrapper animation="slide-up" delay={100}>
              <div className="p-6 border rounded-xl text-center">
                <h3 className="text-lg font-medium mb-2">Founders</h3>
                <p className="text-muted-foreground text-sm">Who want clarity without overwhelm</p>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={200}>
              <div className="p-6 border rounded-xl text-center">
                <h3 className="text-lg font-medium mb-2">Business Owners</h3>
                <p className="text-muted-foreground text-sm">Ready to delegate, scale or exit</p>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={300}>
              <div className="p-6 border rounded-xl text-center">
                <h3 className="text-lg font-medium mb-2">Coaches & Advisors</h3>
                <p className="text-muted-foreground text-sm">Who want to help clients go deeper</p>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-up" delay={400}>
              <div className="p-6 border rounded-xl text-center">
                <h3 className="text-lg font-medium mb-2">Purpose-Driven Leaders</h3>
                <p className="text-muted-foreground text-sm">Building businesses that matter</p>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 md:px-8 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="font-semibold tracking-tight mb-4">Testimonials</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Here's what people are saying about Prosper with Purpose
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 gap-8">
            <TransitionWrapper animation="fade" delay={100}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md">
                <p className="italic mb-6 text-lg">
                  "Colin has really helped me focus on the key priorities… It's been invaluable having an experienced and empathetic person to talk to."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">LH</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Dr Lia Hunter</h4>
                    <p className="text-sm text-muted-foreground">Founder, CGX</p>
                  </div>
                </div>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="fade" delay={200}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md">
                <p className="italic mb-6 text-lg">
                  "After going through a structural change, Colin helped us define our mission and set us on the path to achieving it."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">DA</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Deborah Allen</h4>
                    <p className="text-sm text-muted-foreground">Founder, DouglasJane Studio</p>
                  </div>
                </div>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-8">
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-semibold tracking-tight">
              Ready to Discover Where Your Business Stands?
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your free business health check and personalised Prosper With Purpose report.
            </p>
            
            <Button asChild size="lg" className="rounded-full px-8 mt-6">
              <Link to="/chat">
                Start Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TransitionWrapper>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 md:px-8 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Prosper with Purpose. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default Index;
