import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, Users, Heart, Award, CheckCircle, Mail, Twitter, Building2, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitionWrapper from '@/components/TransitionWrapper';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-8 bg-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          <TransitionWrapper animation="slide-up">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                About <span className="text-yellow-400 italic">Prosper With Purpose</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Transforming businesses worldwide through proven methodologies that prioritize sustainable growth without burnout
              </p>
            </div>
          </TransitionWrapper>
        </div>
      </section>

      {/* Colin Crooks Background Section */}
      <section className="py-24 px-6 md:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Meet Colin Crooks MBE</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A good listener who creates rapport and asks the right questions to identify the salient issues
              </p>
            </div>
          </TransitionWrapper>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <TransitionWrapper animation="slide-right">
              <Card className="relative overflow-hidden border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">Colin Crooks MBE</CardTitle>
                      <CardDescription className="text-gray-300 text-lg">
                        Serial Social Entrepreneur & Author
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-gray-300 leading-relaxed">
                    As a serial social entrepreneur with a track record of establishing impactful and sustainable social enterprises, Colin was awarded an MBE in the 2019 New Year's Honours list for services to disadvantaged people and the environment.
                  </p>
                  
                  <p className="text-gray-300 leading-relaxed">
                    He believes that significant social and environmental benefits can be created through ethical business and his book 'How to Make a Million Jobs, A charter for social enterprise' set out a route map for encouraging social enterprise.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-yellow-400" />
                      <a href="mailto:colin@intentionality.co.uk" className="text-gray-300 hover:text-yellow-400 transition-colors">
                        colin@intentionality.co.uk
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-300">@ColinCrooks</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Qualified coach in enterprise and start-up development</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Author of "How to make a million jobs – A Charter for Social Enterprise"</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300">Queen's Award for Enterprise (Sustainable Development) 2008</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TransitionWrapper>

            <TransitionWrapper animation="slide-left" delay={200}>
              <div className="space-y-8">
                <Card className="relative overflow-hidden border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Philosophy</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Starting or growing a business can be very demanding and at times confusing. Founders and directors are often too close to the detail to see the bigger picture and at certain crucial points they need help to gain a different perspective.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Colin has a proven track record of being able to get to the heart of the issue and put together a plan that matches the challenge. He will put together the right blend of experienced and empathetic people that is right for your situation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Current Roles</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-white">Director at Locality</h4>
                          <p className="text-gray-300 text-sm">National network supporting community organisations with responsibility for Diversity, Equality and Inclusion</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-white">Director at SE24</h4>
                          <p className="text-gray-300 text-sm">Community Benefit Society dedicated to locally-owned renewable energy projects and energy conservation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="py-24 px-6 md:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Track Record of Success</h2>
              <p className="text-xl text-gray-300">Over 30 years of building impactful social enterprises</p>
            </div>
          </TransitionWrapper>

          <div className="space-y-8">
            {[
              {
                period: "2011 – 2021",
                title: "Tree Shepherd",
                role: "Founder and CEO",
                description: "Social enterprise proving that jobs can be created in communities with high structural unemployment. Trained & supported >2,600 people, with 40% starting a business and created £8.73 for every £1 of investment.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                period: "2000 – 2011",
                title: "Green-Works",
                role: "Founder and CEO",
                description: "Pioneered commercial furniture reuse and recycling market. Diverted 47,000 tonnes from landfill, created employment for 850 marginalised people across 5 UK locations. Grew turnover from £3,000 to £3m. Received Queen's Award for Enterprise 2008.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                period: "1994 – 2002",
                title: "3Re Environmental Consultancy",
                role: "Founder & Managing Director",
                description: "Pioneered commercial waste auditing and Shared Savings business model.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                period: "1989 – 1994",
                title: "Papercycle",
                role: "Founder & Managing Director",
                description: "B2B recycling service started with £150 investment. First to offer mixed material recycling model for office paper, cardboard, plastics, metals and printer consumables.",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((experience, index) => (
              <TransitionWrapper key={index} animation="slide-up" delay={index * 100}>
                <Card className="relative overflow-hidden border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 group hover:bg-white/15 transition-all duration-300">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${experience.gradient}`}></div>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                        <div className="text-sm text-yellow-400 font-semibold mb-2">{experience.period}</div>
                        <h3 className="text-xl font-bold text-white mb-1">{experience.title}</h3>
                        <div className="text-gray-400 text-sm">{experience.role}</div>
                      </div>
                      <div className="md:col-span-3">
                        <p className="text-gray-300 leading-relaxed">{experience.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TransitionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Executive Roles */}
      <section className="py-24 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <TransitionWrapper animation="slide-right">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
                  <p className="text-xl text-gray-300 leading-relaxed mb-6">
                    We believe that business success shouldn't come at the cost of personal well-being. Our mission is to help entrepreneurs and business leaders build thriving companies while maintaining their health, relationships, and sense of purpose.
                  </p>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Through our proven Three Pillars framework - Plan, People, and Profits - we've helped over 10,000 businesses across 50+ countries achieve sustainable growth.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Purpose-Driven Growth</h3>
                    <p className="text-gray-400">Building businesses that matter</p>
                  </div>
                </div>
              </div>
            </TransitionWrapper>
            
            <TransitionWrapper animation="slide-left" delay={200}>
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl"></div>
                <img 
                  src="/lovable-uploads/c84b7480-caf5-42d4-b90e-0507c12129e0.png" 
                  alt="Prosper with Purpose book" 
                  className="relative w-full max-w-md mx-auto shadow-2xl rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8"
                />
              </div>
            </TransitionWrapper>
          </div>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="py-24 px-6 md:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The Three Pillars Framework</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our proven methodology that has transformed thousands of businesses worldwide
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Plan",
                icon: Target,
                description: "Strategic clarity with actionable roadmaps that align your vision with measurable outcomes.",
                features: ["Clear vision & mission", "Strategic planning", "Goal setting & tracking", "Performance metrics"],
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "People",
                icon: Users,
                description: "Build and lead high-performing teams that are engaged, motivated, and aligned with your purpose.",
                features: ["Team building", "Leadership development", "Culture creation", "Employee engagement"],
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "Profits",
                icon: Award,
                description: "Sustainable financial growth through smart systems, processes, and strategic decision-making.",
                features: ["Financial planning", "Revenue optimization", "Cost management", "Sustainable growth"],
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((pillar, index) => (
              <TransitionWrapper key={index} animation="slide-up" delay={index * 150}>
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/10 backdrop-blur-lg border border-white/20 group h-full">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.gradient}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${pillar.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <pillar.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{pillar.title}</CardTitle>
                    <CardDescription className="text-gray-300 leading-relaxed text-base">
                      {pillar.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-3">
                      {pillar.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TransitionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 px-6 md:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Our Impact</h2>
              <p className="text-xl text-gray-300">Real results from real businesses</p>
            </div>
          </TransitionWrapper>
          
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

      {/* Values Section */}
      <section className="py-24 px-6 md:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <TransitionWrapper>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-white mb-6">Our Values</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
          </TransitionWrapper>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Purpose Over Profit",
                description: "We believe that businesses built with a clear purpose create more value for everyone - customers, employees, and society.",
                icon: Heart,
                gradient: "from-red-500 to-pink-500"
              },
              {
                title: "Sustainable Growth",
                description: "Growth at any cost is not growth at all. We focus on building businesses that can thrive for the long term.",
                icon: BookOpen,
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "People First",
                description: "Behind every successful business are passionate people. We prioritize human well-being in all our strategies.",
                icon: Users,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Practical Wisdom",
                description: "We combine proven business principles with practical, actionable strategies that work in the real world.",
                icon: Target,
                gradient: "from-purple-500 to-indigo-500"
              }
            ].map((value, index) => (
              <TransitionWrapper key={index} animation="slide-up" delay={index * 100}>
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/10 backdrop-blur-lg border border-white/20 group">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${value.gradient}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${value.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">{value.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{value.description}</p>
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
      <section className="py-24 px-6 md:px-8 bg-slate-900">
        <TransitionWrapper animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 group hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="relative p-12 z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:text-yellow-400 transition-colors duration-300">
                  Ready to Build Your Purpose-Driven Business?
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8 group-hover:text-gray-200 transition-colors duration-300">
                  Start your transformation journey today with our free business health check
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-300 hover:to-yellow-400 rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl border-0 transform hover:scale-105 transition-all duration-300">
                    <Link to="/chat">
                      Get Your Free Analysis
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-2xl px-8 py-6 text-lg font-semibold backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                    <Link to="/">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Home
                    </Link>
                  </Button>
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

export default About;
