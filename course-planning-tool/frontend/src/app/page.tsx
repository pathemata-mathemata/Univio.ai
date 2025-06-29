"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Database, MapPin } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

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
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/univio-logo.png"
              alt="UniVio.AI"
              width={240}
              height={98}
              className="h-12 w-auto"
              priority
            />
          </div>
          <div className="flex space-x-3">
            <Link href="/auth/login">
              <Button 
                variant="ghost" 
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-200 font-medium px-6 border border-white/30"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 font-medium px-6 shadow-lg shadow-blue-500/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* California Focus Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Now Serving California Community Colleges</span>
          </div>

          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            AI-Powered Transfer
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Navigate your California community college to UC/CSU transfer journey with 
            <span className="text-blue-400 font-semibold"> intelligent course planning</span> and 
            <span className="text-purple-400 font-semibold"> real-time ASSIST.org integration</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-10 py-6 rounded-xl shadow-lg shadow-blue-500/25 border-0">
                Start Planning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-200 text-lg px-10 py-6 rounded-xl border border-white/30 font-medium">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Simplified Features - High Tech Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">AI Course Planning</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   Intelligent recommendations for optimal transfer paths to UC and CSU systems
                 </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
                  <Database className="w-8 h-8 text-white" />
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">ASSIST.org Integration</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   Real-time access to California transfer requirements and articulation agreements
                 </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/25">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">California Focused</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   Specialized for California community college students transferring within state
                 </p>
              </CardContent>
            </Card>
          </div>

          {/* California-specific institutions showcase */}
          <div className="mt-20 text-center">
            <p className="text-gray-400 text-sm mb-6">Trusted by students transferring to:</p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm font-medium">
              <span className="hover:text-blue-400 transition-colors">UC Berkeley</span>
              <span className="hover:text-blue-400 transition-colors">UCLA</span>
              <span className="hover:text-blue-400 transition-colors">UC San Diego</span>
              <span className="hover:text-blue-400 transition-colors">Cal Poly SLO</span>
              <span className="hover:text-blue-400 transition-colors">SDSU</span>
              <span className="hover:text-blue-400 transition-colors">CSULB</span>
            </div>
          </div>

          {/* Simplified CTA */}
          <div className="mt-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Ready to Transfer Smart?
            </h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Join California students who are planning their UC/CSU transfer journey with AI-powered precision.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-10 py-6 rounded-xl shadow-lg shadow-blue-500/25 border-0">
                Start Your California Transfer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 mt-20 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 UniVio.AI - Empowering California Community College Transfers</p>
        </div>
      </footer>
    </div>
  );
} 