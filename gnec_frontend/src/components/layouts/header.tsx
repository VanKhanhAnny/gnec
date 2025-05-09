"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Container from "../core/container";
import Logo from "@/components/layouts/logo";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const commonStyle = "lg:text-[0.9rem] md:text-[0.8rem] text-sm font-[700] hover:underline";
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <header className="sticky top-0 h-[6.7rem] bg-gradient-to-b from-[#0d9488] via-[#ccfbf1] to-transparent z-50 shadow-sm">
      <Container className="flex justify-between items-center py-4">
        <Logo />
        
        <button
          className="block md:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link href="/" className={commonStyle}>HOME</Link>
          <Link href="/jobs" className={commonStyle}>FIND JOBS</Link>
          <Link href="/sign-language" className={commonStyle}>SIGN LANGUAGE</Link>
          <Link href="/un-goals" className={commonStyle}>UN GOALS</Link>
          <Link href="/comming-soon" className={commonStyle}>ABOUT US</Link>
          
          <div className="flex items-center gap-4 ml-4">
            <SignedOut>
              <SignInButton>
                <Button className="cursor-pointer">Sign in</Button>
              </SignInButton>
              <SignUpButton>
                <Button className="cursor-pointer" variant="outline">Sign up</Button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <Link href="/profile" className={commonStyle}>
                PROFILE
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </nav>
        
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background z-50 md:hidden overflow-y-auto">
            <Container>
              <div className="flex justify-between items-center py-4">
                <Logo />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-6 py-8">
                <Link 
                  href="/" 
                  className={commonStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link 
                  href="/jobs" 
                  className={commonStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FIND JOBS
                </Link>
                <Link 
                  href="/sign-language" 
                  className={commonStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SIGN LANGUAGE
                </Link>
                <Link 
                  href="/un-goals" 
                  className={commonStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  UN GOALS
                </Link>
                <Link 
                  href="/comming-soon" 
                  className={commonStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ABOUT US
                </Link>
                
                <div className="flex flex-col gap-4 mt-4">
                  <SignedOut>
                    <SignInButton>
                      <Button 
                        className="w-full cursor-pointer" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign in
                      </Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button 
                        variant="outline" 
                        className="w-full cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign up
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  
                  <SignedIn>
                    <Link 
                      href="/profile" 
                      className={commonStyle}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      PROFILE
                    </Link>
                    <div 
                      className="flex justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserButton />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </Container>
          </div>
        )}
      </Container>
    </header>
  );
}