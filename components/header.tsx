"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[960px] px-4">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg shadow-black/5 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 sm:w-8 sm:h-8 relative">
              <Image src="/favicon.ico" alt="Serif" width={32} height={32} className="rounded-lg" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900">Serif</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/blogs" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              博客
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Docs
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-full px-4">
              Sign up →
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200/50">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/blogs" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                博客
              </Link>
              <Link 
                href="/features" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200/50">
                <Button variant="ghost" size="sm" className="justify-start">
                  Sign in
                </Button>
                <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-full">
                  Sign up →
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
