import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, FileText, Lightbulb, BarChart3, ArrowRight, CheckCircle, Users, PieChart, Compass, Headphones, Star, Zap, Target, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionWrapper from '@/components/TransitionWrapper';
import FeatureCard from '@/components/FeatureCard';
import TalkToAuthorDialog from '@/components/TalkToAuthorDialog';

const Index = () => {
  const [isTalkToAuthorOpen, setIsTalkToAuthorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Talk to Author Dialog */}
      <TalkToAuthorDialog isOpen={isTalkToAuthorOpen} onClose={() => setIsTalkToAuthorOpen(false)} />
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-32 px-4 md:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <TransitionWrapper animation="slide-right">
              <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                    Build Stronger
                    <br />
                    Businesses <span className="text-yellow-400 italic">With</span>
                    <br />
                    <span className="text-yellow-400 italic">Less Stress</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Transform your business with AI-powered insights from <span className="font-semibold text-white">Prosper With Purpose</span>
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 md:gap-4 max-w-md mx-auto lg:max-w-none lg:mx-0 lg:flex-row">
                  <Button asChild size="lg" className="bg-yellow-400 text-slate-900 hover:bg-yellow-300 rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold shadow-lg border-0 w-full lg:w-auto">
                    <Link to="/chat">
                      <span className="hidden sm:inline">Get Your Free Business Health Check</span>
                      <span className="sm:hidden">Free Business Health Check</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-slate-900 transition-all duration-300 w-full lg:w-auto" onClick={() => setIsTalkToAuthorOpen(true)}>
                    Talk to the Author
                  </Button>
                </div>
              </div>
            </TransitionWrapper>
            
            {/* Right Book Image */}
            <TransitionWrapper animation="slide-left" delay={200}>
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div className="relative">
                  <img src="/lovable-uploads/BookDigital.png" alt="Prosper with Purpose book" className="w-64 sm:w-80 md:w-96 lg:w-[500px] xl:w-[600px] h-auto" />
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
            {[{
            number: "10,000+",
            label: "Businesses Transformed"
          }, {
            number: "95%",
            label: "Success Rate"
          }, {
            number: "50+",
            label: "Countries Reached"
          }, {
            number: "4.9★",
            label: "Average Rating"
          }].map((stat, index) => <TransitionWrapper key={index} animation="slide-up" delay={index * 100}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-3">{stat.number}</div>
                  <div className="text-sm text-gray-300 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </TransitionWrapper>)}
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
            {[{
            step: "01",
            title: "Share Your Business Info",
            description: "Quick form with your company details. Our automation tools analyze your online presence.",
            icon: Target,
            gradient: "from-blue-500 to-cyan-500"
          }, {
            step: "02",
            title: "AI Analysis + Book Insights",
            description: "Combine your data with Prosper With Purpose wisdom and structured business analysis.",
            icon: Bot,
            gradient: "from-purple-500 to-pink-500"
          }, {
            step: "03",
            title: "Get Personalized Report",
            description: "Receive tailored recommendations with practical next steps for sustainable growth.",
            icon: TrendingUp,
            gradient: "from-green-500 to-emerald-500"
          }].map((item, index) => <TransitionWrapper key={index} animation="slide-up" delay={index * 150}>
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
              </TransitionWrapper>)}
          </div>
        </div>
      </section>
      
      {/* Book Details Section */}
      <section className="py-24 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0 bg-slate-900"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <TransitionWrapper animation="slide-right" delay={100}>
              <div className="relative">
                <img src="/lovable-uploads/c84b7480-caf5-42d4-b90e-0507c12129e0.png" alt="Prosper with Purpose book cover" className="relative w-full max-w-md mx-auto" />
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-left" delay={200}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Three Pillars</h2>
                  <p className="text-xl text-gray-300">
                    Build success without burnout through our proven framework
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[{
                  icon: Compass,
                  title: "Plan",
                  description: "Strategic direction with clear, actionable roadmaps",
                  gradient: "from-blue-500 to-cyan-500"
                }, {
                  icon: Users,
                  title: "People",
                  description: "Build and lead high-performing, engaged teams",
                  gradient: "from-green-500 to-emerald-500"
                }, {
                  icon: PieChart,
                  title: "Profits",
                  description: "Sustainable growth with smart financial management",
                  gradient: "from-purple-500 to-pink-500"
                }].map((pillar, index) => <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${pillar.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <pillar.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">{pillar.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{pillar.description}</p>
                      </div>
                    </div>)}
                </div>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>
      
      {/* Report Features */}
      <section className="py-24 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <TransitionWrapper>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Your Complete Business Analysis</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to take your business to the next level
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[{
            icon: FileText,
            title: "Executive Summary",
            description: "AI-powered analysis based on your business profile",
            gradient: "from-blue-500 to-cyan-500"
          }, {
            icon: Lightbulb,
            title: "Strategic Insights",
            description: "Key observations aligned with proven business principles",
            gradient: "from-amber-500 to-orange-500"
          }, {
            icon: Target,
            title: "Action Plan",
            description: "Step-by-step exercises to implement immediately",
            gradient: "from-green-500 to-emerald-500"
          }, {
            icon: BarChart3,
            title: "Growth Roadmap",
            description: "Data-driven recommendations for sustainable expansion",
            gradient: "from-purple-500 to-pink-500"
          }].map((feature, index) => <TransitionWrapper key={index} animation="slide-up" delay={index * 100}>
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/10 backdrop-blur-lg border border-white/20 group">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-300 leading-relaxed text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </TransitionWrapper>)}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <TransitionWrapper>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Success Stories</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real results from real businesses
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[{
            quote: "Colin has really helped me to focus on the key priorities for CGX. He's helped me to think through where we want to be and currently, we're developing a marketing plan for how to get there. On the way we're also addressing essentials like our pricing model and cash management. It's been invaluable having an experienced and empathetic person to talk to especially when the going has been tough.",
            author: "Dr Lia Hunter",
            role: "Founder, CGX",
            initials: "LH",
            rating: 5
          }, {
            quote: "Colin took time to get to know the business and observe my way-too-deep involvement in many aspects of it. .. I am now no longer involved in managing most of the manufacturing process and have far fewer worries — and phone calls —when I'm away from the office. I have worked only 3 Saturdays in the last six months.",
            author: "Andy Hall",
            role: "Co-Founder and Managing Director, Just Electronics Ltd.",
            initials: "AH",
            rating: 5
          }].map((testimonial, index) => <TransitionWrapper key={index} animation="fade" delay={index * 100}>
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/10 backdrop-blur-lg border border-white/20 group h-full flex flex-col">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 relative z-10 flex-1 flex flex-col">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                    </div>
                    <blockquote className="text-lg text-gray-300 mb-8 italic leading-relaxed font-medium flex-1">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">{testimonial.initials}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-lg group-hover:text-yellow-400 transition-colors duration-300">{testimonial.author}</div>
                        <div className="text-sm text-gray-400 font-medium">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TransitionWrapper>)}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 group hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              
              <CardContent className="relative p-12 z-10">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 group-hover:text-yellow-400 transition-colors duration-300">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto group-hover:text-gray-200 transition-colors duration-300">
                    Get your personalized business health check and start building with purpose
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-300 hover:to-yellow-400 rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group/btn">
                    <Link to="/chat">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 group-hover/btn:animate-pulse" />
                        Start Your Free Analysis
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-black hover:bg-white/10 hover:border-white/50 rounded-2xl px-8 py-6 text-lg font-semibold backdrop-blur-sm transform hover:scale-105 transition-all duration-300 group/btn2" onClick={() => setIsTalkToAuthorOpen(true)}>
                    <Headphones className="mr-2 h-5 w-5 group-hover/btn2:animate-pulse" />
                    Talk to the Author
                  </Button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>No credit card required</span>
                    <span className="text-white/30">•</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Instant results</span>
                    <span className="text-white/30">•</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Trusted by 10,000+ businesses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TransitionWrapper>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
