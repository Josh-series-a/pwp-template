import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  FileText,
  Users,
  CreditCard,
  Settings,
  Shield,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using our platform",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-700",
      items: [
        { title: "Creating Your First Report", href: "/dashboard/reports" },
        { title: "Understanding Business Health Scores", href: "#" },
        { title: "Setting Up Your Profile", href: "/profile" },
        { title: "Navigating the Dashboard", href: "/dashboard" }
      ]
    },
    {
      title: "Exercises & Assessment",
      description: "Complete exercises to improve your business",
      icon: FileText,
      color: "bg-green-50 text-green-700",
      items: [
        { title: "How to Complete Exercises", href: "/dashboard/exercises" },
        { title: "Understanding Exercise Results", href: "#" },
        { title: "Tracking Your Progress", href: "#" },
        { title: "Best Practices for Assessments", href: "#" }
      ]
    },
    {
      title: "Account Management",
      description: "Manage your subscription and settings",
      icon: Settings,
      color: "bg-purple-50 text-purple-700",
      items: [
        { title: "Account Settings", href: "/account" },
        { title: "Subscription Plans", href: "#" },
        { title: "Billing Information", href: "#" },
        { title: "Team Management", href: "#" }
      ]
    },
    {
      title: "Support & Contact",
      description: "Get help when you need it",
      icon: MessageCircle,
      color: "bg-orange-50 text-orange-700",
      items: [
        { title: "Contact Support", href: "/contact" },
        { title: "Live Chat", href: "#" },
        { title: "Email Support", href: "mailto:support@example.com" },
        { title: "Community Forum", href: "#" }
      ]
    }
  ];

  const frequentlyAsked = [
    {
      question: "How do I create my first business health report?",
      answer: "Navigate to the Reports section in your dashboard and click 'Create New Report'. Follow the guided setup to input your company details and complete the required assessments."
    },
    {
      question: "What are credits and how do I use them?",
      answer: "Credits are used to generate reports and access premium features. Each report generation consumes a certain number of credits based on the complexity and depth of analysis."
    },
    {
      question: "Can I invite team members to collaborate?",
      answer: "Yes! You can invite team members through your account settings. Different permission levels are available depending on your subscription plan."
    },
    {
      question: "How often should I complete business health assessments?",
      answer: "We recommend completing assessments quarterly to track your business progress effectively. However, you can run them as frequently as needed."
    },
    {
      question: "What happens if I run out of credits?",
      answer: "You can purchase additional credits through your account settings, or upgrade to a higher tier plan that includes more credits per month."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 pt-32">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find answers to your questions and learn how to make the most of our platform
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-2xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Contact Support</h3>
              <p className="text-sm text-gray-300 mb-4">Get help from our support team</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-2xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Documentation</h3>
              <p className="text-sm text-gray-300 mb-4">Browse our comprehensive guides</p>
              <Button variant="outline" size="sm">
                View Docs
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-2xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Community</h3>
              <p className="text-sm text-gray-300 mb-4">Connect with other users</p>
              <Button variant="outline" size="sm">
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{category.title}</CardTitle>
                        <CardDescription className="text-gray-300">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.href}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors group"
                        >
                          <span className="text-sm text-white">{item.title}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <Accordion type="multiple" className="space-y-4">
            {frequentlyAsked.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still Need Help */}
        <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Still need help?</h3>
            <p className="text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline">
                Schedule a Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Help;