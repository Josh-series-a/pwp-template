import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, FileText, Lightbulb, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import TransitionWrapper from '@/components/TransitionWrapper';
import FeatureCard from '@/components/FeatureCard';
const Index = () => {
  return <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <TransitionWrapper animation="fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <span className="text-xs font-medium">Welcome to Propser with Purpose</span>
            </div>
          </TransitionWrapper>
          
          <TransitionWrapper animation="slide-down" delay={100}>
            <h1 className="font-semibold tracking-tighter leading-tight mb-4">
              Your AI Business <br className="md:hidden" /> Analysis Expert
            </h1>
          </TransitionWrapper>
          
          <TransitionWrapper animation="slide-up" delay={200}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Upload your Documents, Business Plan or Pitch Deck</p>
          </TransitionWrapper>
          
          <TransitionWrapper animation="slide-up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/chat">
                  Start Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </TransitionWrapper>
        </div>
      </section>
      
      {/* Demo GIF/Image */}
      <TransitionWrapper animation="blur" delay={400}>
        <div className="relative max-w-5xl mx-auto px-6 md:px-8 mb-24">
          <div className="rounded-2xl overflow-hidden glass-card aspect-video">
            {/* This would normally be an actual image/video */}
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
              <div className="text-center p-8">
                <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-medium mb-2">Interactive AI Business Analysis</h3>
                <p className="text-muted-foreground">
                  Upload documents, get insights, and explore new business perspectives
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs mx-auto">
            <div className="glass-card rounded-full px-6 py-3 text-center text-sm font-medium backdrop-blur-lg">
              Based on advanced AI analysis technology
            </div>
          </div>
        </div>
      </TransitionWrapper>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-8 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="font-semibold tracking-tight mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our AI reads and understands your business documents, then engages with you
                through insightful questions and strategic analysis.
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<FileText className="h-6 w-6" />} title="Document Analysis" description="Upload reports, strategies, financial data, and other business documents for comprehensive analysis." delay={100} />
            
            <FeatureCard icon={<Bot className="h-6 w-6" />} title="AI Conversation" description="Engage in a conversation with an AI that understands your business context and challenges your thinking." delay={200} />
            
            <FeatureCard icon={<Lightbulb className="h-6 w-6" />} title="Strategic Insights" description="Receive insights, suggestions, and alternative perspectives that might not be immediately obvious." delay={300} />
            
            <FeatureCard icon={<BarChart3 className="h-6 w-6" />} title="Data Visualization" description="View key metrics and trends extracted from your documents in easy-to-understand visual formats." delay={400} className="md:col-span-2 lg:col-span-3" />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-8">
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-semibold tracking-tight">
              Ready to Gain New Business Insights?
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start uploading your business documents and engaging with your AI business analysis expert.
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