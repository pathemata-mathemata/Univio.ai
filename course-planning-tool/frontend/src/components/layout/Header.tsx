"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { UserMenu } from "./UserMenu";

export function Header(): JSX.Element {
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);

  // Navigation links data
  const navLinks = [
    { title: "AI Scheduler", href: "/dashboard/planning/new", available: true },
    { title: "Find Professor", href: "#", available: false },
    { title: "Find Classmate", href: "#", available: false },
    { title: "My Profile", href: "/dashboard/profile", available: true },
  ];

  const handleComingSoonClick = (title: string) => {
    setShowComingSoon(title);
    setTimeout(() => setShowComingSoon(null), 2000);
  };

  return (
    <header className="flex items-center justify-between px-10 py-3 border-b border-[#e5e8ea] w-full bg-white">
      {/* Left side - Logo and brand */}
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/images/univio-logo.png"
            alt="UniVio.AI"
            width={200}
            height={82}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Right side - Navigation, search and profile */}
      <div className="flex items-center gap-8">
        {/* Navigation links */}
        <nav className="flex items-center gap-9 h-10">
          {navLinks.map((link, index) => (
            <div key={index} className="relative">
              {link.available ? (
                <Link href={link.href}>
                  <Button
                    variant="ghost"
                    className="h-10 px-0 font-medium text-sm text-[#111416] hover:text-[#111416]/80"
                  >
                    {link.title}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  className="h-10 px-0 font-medium text-sm text-[#111416] hover:text-[#111416]/80"
                  onClick={() => handleComingSoonClick(link.title)}
                >
                  {link.title}
                </Button>
              )}
              
              {/* Coming Soon Tooltip */}
              {showComingSoon === link.title && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-[#111416] text-white text-xs rounded-md whitespace-nowrap z-50">
                  Coming Soon
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#111416]"></div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search input */}
        <div className="relative max-w-[480px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            className="h-10 pl-9 bg-[#eff2f4] rounded-[20px] border-none"
            placeholder="Search courses, requirements..."
          />
        </div>

        {/* User profile */}
        <UserMenu />
      </div>
    </header>
  );
} 