import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, FileText, Lightbulb, BarChart3, ArrowRight, CheckCircle, Users, PieChart, Compass, Headphones, Star, Zap, Target, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import TransitionWrapper from '@/components/TransitionWrapper';
import FeatureCard from '@/components/FeatureCard';
import TalkToAuthorDialog from '@/components/TalkToAuthorDialog';

const Index = () => {
  const [isTalkToAuthorOpen, setIsTalkToAuthorOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Talk to Author Dialog */}
      <TalkToAuthorDialog 
        isOpen={isTalkToAuthorOpen}
        onClose={() => setIsTalkToAuthorOpen(false)}
      />
      
      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <TransitionWrapper animation="slide-right">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    Build Stronger
                    <br />
                    Businesses <span className="text-yellow-400 italic">With</span>
                    <br />
                    <span className="text-yellow-400 italic">Less Stress</span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                    Transform your business with AI-powered insights from <span className="font-semibold text-white">Prosper With Purpose</span>
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-yellow-400 text-slate-900 hover:bg-yellow-300 rounded-full px-8 py-6 text-lg font-semibold shadow-lg border-0">
                    <Link to="/chat">
                      Get Your Free Business Health Check
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
                    onClick={() => setIsTalkToAuthorOpen(true)}
                  >
                    Talk to the Author
                  </Button>
                </div>
              </div>
            </TransitionWrapper>
            
            {/* Right Book Image */}
            <TransitionWrapper animation="slide-left" delay={200}>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/c84b7480-caf5-42d4-b90e-0507c12129e0.png" 
                    alt="Prosper with Purpose book" 
                    className="w-96 lg:w-[500px] xl:w-[600px] h-auto"
                  />
                </div>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 px-6 md:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Businesses Transformed" },
              { number: "95%", label: "Success Rate" },
              { number: "50+", label: "Countries Reached" },
              { number: "4.9★", label: "Average Rating" }
            ].map((stat, index) => (
              <TransitionWrapper key={index} animation="slide-up" delay={index * 100}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-3">{stat.number}</div>
                  <div className="text-sm text-gray-300 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </TransitionWrapper>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0 bg-slate-900"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <TransitionWrapper>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our AI system combines your business data with proven methodologies to deliver actionable insights
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Share Your Business Info",
                description: "Quick form with your company details. Our automation tools analyze your online presence.",
                icon: Target,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "AI Analysis + Book Insights",
                description: "Combine your data with Prosper With Purpose wisdom and structured business analysis.",
                icon: Bot,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Get Personalized Report", 
                description: "Receive tailored recommendations with practical next steps for sustainable growth.",
                icon: TrendingUp,
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <TransitionWrapper key={index} animation="slide-up" delay={index * 150}>
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/10 backdrop-blur-lg border border-white/20 group">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-bold text-gray-400 mb-2 tracking-wider">STEP {item.step}</div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-300 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </TransitionWrapper>
            ))}
          </div>
        </div>
      </section>
      
      {/* Book Details Section */}
      <section className="py-24 px-6 md:px-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <TransitionWrapper animation="slide-right" delay={100}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
                <img 
                  src="/lovable-uploads/c84b7480-caf5-42d4-b90e-0507c12129e0.png" 
                  alt="Prosper with Purpose book cover" 
                  className="relative w-full max-w-md mx-auto shadow-2xl rounded-2xl"
                />
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-left" delay={200}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">The Three Pillars</h2>
                  <p className="text-xl text-slate-600 dark:text-slate-300">
                    Build success without burnout through our proven framework
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: Compass,
                      title: "Plan",
                      description: "Strategic direction with clear, actionable roadmaps",
                      color: "text-blue-600 dark:text-blue-400"
                    },
                    {
                      icon: Users,
                      title: "People", 
                      description: "Build and lead high-performing, engaged teams",
                      color: "text-green-600 dark:text-green-400"
                    },
                    {
                      icon: PieChart,
                      title: "Profits",
                      description: "Sustainable growth with smart financial management",
                      color: "text-purple-600 dark:text-purple-400"
                    }
                  ].map((pillar, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${pillar.color === 'text-blue-600 dark:text-blue-400' ? 'from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50' : pillar.color === 'text-green-600 dark:text-green-400' ? 'from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50' : 'from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50'}`}>
                        <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pillar.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300">{pillar.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* Report Features */}
      <section className="py-24 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Your Complete Business Analysis</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Everything you need to take your business to the next level
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: FileText,
                title: "Executive Summary",
                description: "AI-powered analysis based on your business profile",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Lightbulb,
                title: "Strategic Insights",
                description: "Key observations aligned with proven business principles",
                gradient: "from-amber-500 to-orange-500"
              },
              {
                icon: Target,
                title: "Action Plan",
                description: "Step-by-step exercises to implement immediately",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: BarChart3,
                title: "Growth Roadmap",
                description: "Data-driven recommendations for sustainable expansion",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={<feature.icon className="h-6 w-6" />} 
                title={feature.title} 
                description={feature.description} 
                delay={index * 100} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 px-6 md:px-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Success Stories</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Real results from real businesses
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "Colin has really helped me focus on the key priorities… It's been invaluable having an experienced and empathetic person to talk to.",
                author: "Dr Lia Hunter",
                role: "Founder, CGX",
                initials: "LH",
                rating: 5
              },
              {
                quote: "After going through a structural change, Colin helped us define our mission and set us on the path to achieving it.",
                author: "Deborah Allen", 
                role: "Founder, DouglasJane Studio",
                initials: "DA",
                rating: 5
              }
            ].map((testimonial, index) => (
              <TransitionWrapper key={index} animation="fade" delay={index * 100}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{testimonial.initials}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TransitionWrapper>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 md:px-8">
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
              <CardContent className="relative p-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl mb-8 text-blue-100">
                  Get your personalized business health check and start building with purpose
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl">
                    <Link to="/chat">
                      Start Your Free Analysis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10 rounded-2xl px-8 py-6 text-lg font-semibold"
                    onClick={() => setIsTalkToAuthorOpen(true)}
                  >
                    <Headphones className="mr-2 h-5 w-5" />
                    Talk to the Author
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TransitionWrapper>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 md:px-8 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">&copy; {new Date().getFullYear()} Prosper with Purpose. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Trusted by 10,000+ businesses worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
