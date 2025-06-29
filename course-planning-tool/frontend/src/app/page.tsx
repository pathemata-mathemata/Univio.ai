"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Database, MapPin, ChevronDown, Shield, HelpCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What is UniVio and how does it help with college transfers?",
      answer: "UniVio is an AI-powered course planning platform designed specifically for California community college students planning to transfer to UC and CSU universities. It provides intelligent course recommendations, real-time requirements analysis through ASSIST.org integration, and personalized academic planning to ensure successful university transfer."
    },
    {
      question: "How do you protect my personal data and privacy?",
      answer: "We take your privacy seriously and implement industry-standard security measures. Your personal information is encrypted and securely stored. We never sell your data to third parties. We only use your academic information to provide personalized course recommendations and track your progress. You can request to delete your account and all associated data at any time."
    },
    {
      question: "Is UniVio free to use?",
      answer: "UniVio offers a free tier that includes basic course planning features and access to ASSIST.org integration. Premium features like advanced AI recommendations, detailed progress tracking, and priority support are available through our paid plans. We believe every student should have access to quality transfer planning tools."
    },
    {
      question: "Which California community colleges and universities are supported?",
      answer: "UniVio supports all California community colleges and provides transfer pathways to all UC and CSU universities. Our platform integrates directly with ASSIST.org to ensure you have access to the most current transfer requirements and articulation agreements for your specific college and target university."
    },
    {
      question: "How accurate are the AI course recommendations?",
      answer: "Our AI recommendations are based on official ASSIST.org data, historical transfer patterns, and current university requirements. While we strive for high accuracy, we always recommend confirming your course plan with your academic advisor. Our platform serves as a powerful planning tool to complement, not replace, professional academic counseling."
    },
    {
      question: "Can I use UniVio if I'm planning to transfer to private universities?",
      answer: "Currently, UniVio is optimized for transfers within the California public university system (UC and CSU). While some of the general course planning features may be helpful for private university transfers, our ASSIST.org integration and AI recommendations are specifically designed for UC/CSU transfer pathways."
    },
    {
      question: "How do I get started with UniVio?",
      answer: "Getting started is simple! Create a free account, input your current community college and intended major, and tell us which UC or CSU universities you're interested in. Our AI will analyze your goals and provide a personalized course plan. You can then track your progress and get updates as requirements change."
    },
    {
      question: "What if my transfer requirements change?",
      answer: "UniVio automatically monitors ASSIST.org for any changes to transfer requirements and will notify you if updates affect your course plan. Our AI continuously adapts your recommendations to ensure you stay on track for successful transfer, even when requirements are updated by universities."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* High-tech background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/univio-logo.png"
              alt="UniVio.AI"
              width={240}
              height={98}
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            <Link href="/auth/login">
              <Button 
                variant="ghost" 
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-200 font-medium px-4 sm:px-6 text-sm sm:text-base border border-white/30"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 font-medium px-4 sm:px-6 text-sm sm:text-base shadow-lg shadow-blue-500/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* California Focus Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Now Serving California Community Colleges</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            AI-Powered Transfer
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Navigate your California community college to UC/CSU transfer journey with 
            <span className="text-blue-400 font-semibold"> intelligent course planning</span> and 
            <span className="text-purple-400 font-semibold"> real-time ASSIST.org integration</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 px-4 sm:px-0">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 rounded-xl shadow-lg shadow-blue-500/25 border-0">
                Start Planning Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-200 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 rounded-xl border border-white/30 font-medium">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Simplified Features - High Tech Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 px-4 sm:px-0">
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-blue-500/25">
                  <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">AI Course Planning</h3>
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  Intelligent recommendations for optimal transfer paths to UC and CSU systems
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-purple-500/25">
                  <Database className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">ASSIST.org Integration</h3>
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  Real-time access to California transfer requirements and articulation agreements
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-teal-500/25">
                  <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">California Focused</h3>
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  Specialized for California community college students transferring within state
                </p>
              </CardContent>
            </Card>
          </div>

          {/* UC & CSU Universities Showcase with Scrolling Animation */}
          <div className="mt-16 sm:mt-20 text-center px-4 sm:px-0">
            <p className="text-gray-400 text-sm mb-6 sm:mb-8">Trusted by students transferring to all UC and CSU universities:</p>
            
            {/* UC System */}
            <div className="mb-6">
              <h4 className="text-blue-400 font-semibold mb-4 text-base sm:text-lg">University of California System</h4>
              <div className="relative overflow-hidden py-4">
                <div className="flex animate-scroll-right space-x-12 whitespace-nowrap">
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Berkeley</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UCLA</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC San Diego</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Santa Barbara</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Irvine</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Davis</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Santa Cruz</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Riverside</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Merced</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC San Francisco</span>
                  {/* Duplicate for seamless infinite scroll */}
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Berkeley</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UCLA</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC San Diego</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Santa Barbara</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Irvine</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Davis</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Santa Cruz</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Riverside</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC Merced</span>
                  <span className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">UC San Francisco</span>
                </div>
              </div>
            </div>

            {/* CSU System */}
            <div>
              <h4 className="text-purple-400 font-semibold mb-4 text-base sm:text-lg">California State University System</h4>
              <div className="relative overflow-hidden py-4">
                <div className="flex animate-scroll-left space-x-12 whitespace-nowrap">
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">San Diego State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Long Beach</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal Poly San Luis Obispo</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal Poly Pomona</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Fullerton</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Northridge</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">San Francisco State</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Sacramento</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">San José State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Fresno</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Los Angeles</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Chico</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State East Bay</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Dominguez Hills</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State San Bernardino</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Stanislaus</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Bakersfield</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Channel Islands</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Monterey Bay</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Humboldt State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal Maritime Academy</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Sonoma State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State San Marcos</span>
                  {/* Duplicate for seamless infinite scroll */}
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">San Diego State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Long Beach</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal Poly San Luis Obispo</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal Poly Pomona</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Fullerton</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Northridge</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">San Francisco State</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Sacramento</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">San José State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Fresno</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Los Angeles</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Chico</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State East Bay</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Dominguez Hills</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State San Bernardino</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Stanislaus</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Bakersfield</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Channel Islands</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State Monterey Bay</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Humboldt State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal Maritime Academy</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Sonoma State University</span>
                  <span className="text-gray-300 hover:text-purple-400 transition-colors text-sm font-medium">Cal State San Marcos</span>
                </div>
              </div>
            </div>
          </div>



          {/* Simplified CTA */}
          <div className="mt-16 sm:mt-20 mx-4 sm:mx-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Ready to Transfer Smart?
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
              Join California students who are planning their UC/CSU transfer journey with AI-powered precision.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 rounded-xl shadow-lg shadow-blue-500/25 border-0">
                Start Your California Transfer
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Comprehensive Footer */}
      <footer className="relative z-10 mt-16 sm:mt-20 border-t border-white/10 bg-gradient-to-b from-black to-gray-900/50">
        <div className="container mx-auto px-4 py-12 sm:py-16">
                    {/* Simplified Footer Content */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-12 text-center sm:text-left">
            
            {/* Product */}
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Dashboard</Link></li>
                <li><Link href="/auth/register" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Get Started</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Security</Link></li>
              </ul>
            </div>

            {/* Legal - Center Column */}
            <div className="flex flex-col items-center">
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Terms</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Cookies</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div className="flex flex-col items-center sm:items-end">
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-3">
                <li><a href="mailto:info@univio.ai" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Contact</a></li>
                <li><a href="https://www.instagram.com/univio.ai?igsh=MXFnN3dxeGxhaDRjOA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Instagram</a></li>
                <li><Link href="/auth/register" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Join Us</Link></li>
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-white/10 pt-12 mb-12">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-white/5 to-white/10 border border-white/20 backdrop-blur-sm rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left flex items-start justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="text-white font-medium text-sm pr-3 sm:pr-4 leading-tight">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-blue-400 transition-transform duration-200 flex-shrink-0 mt-0.5 ${
                        openFAQ === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFAQ === index && (
                    <div className="px-4 sm:px-5 pb-3 sm:pb-4">
                      <div className="border-t border-white/10 pt-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Privacy Notice in Footer */}
            <div className="mt-8 bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-green-400 font-semibold text-sm mb-1">Your Privacy Matters</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    We protect your data with industry-standard security. Never shared with third parties. 
                    <Link href="/privacy" className="text-green-400 underline ml-1">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
              <Image
                src="/images/univio-logo.png"
                alt="UniVio.AI"
                width={240}
                height={98}
                className="h-6 sm:h-8 w-auto mb-2 sm:mb-0 sm:mr-3"
                priority
              />
              <span className="text-gray-400 text-xs sm:text-sm">© 2024 UniVio.AI - Empowering California Community College Transfers</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Made with ❤️ for California students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 