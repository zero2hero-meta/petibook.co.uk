'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import HamburgerMenu from './HamburgerMenu'

interface HeaderProps {
  user?: any
}

export default function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoTooltip, setShowLogoTooltip] = useState(false)
  const logoHideTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleLogoEnter = () => {
    if (logoHideTimeout.current) {
      clearTimeout(logoHideTimeout.current)
      logoHideTimeout.current = null
    }
    setShowLogoTooltip(true)
  }

  const handleLogoLeave = () => {
    if (logoHideTimeout.current) {
      clearTimeout(logoHideTimeout.current)
    }
    logoHideTimeout.current = setTimeout(() => {
      setShowLogoTooltip(false)
    }, 400)
  }

  useEffect(() => {
    return () => {
      if (logoHideTimeout.current) {
        clearTimeout(logoHideTimeout.current)
      }
    }
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div
            className="relative flex items-center"
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
          >
            <Link
              href="/"
              className="flex items-center space-x-3"
            >
              <img
                src="/images/homepage-slide/logo1120x120.jpg"
                alt="PetiBoo.co.uk logo"
                className="h-14 w-auto rounded-md border border-purple-100 shadow-sm"
              />
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-coral-500 bg-clip-text text-transparent">
                PetiBoo
              </div>
            </Link>
            {showLogoTooltip && (
              <div
                className="absolute left-1/2 top-full mt-3 w-[260px] h-[150px] -translate-x-1/2 rounded-xl border border-purple-200 bg-white shadow-lg p-3 text-xs text-gray-700 flex items-start gap-3"
                onMouseEnter={() => setShowLogoTooltip(true)}
                onMouseLeave={() => setShowLogoTooltip(false)}
              >
                <img
                  src="/images/homepage-slide/logo1120x120.jpg"
                  alt="PetiBoo mini logo"
                  className="h-[120px] w-[120px] rounded-md border border-purple-100 shadow-sm object-contain self-start"
                />
                <div className="flex-1 self-start">
                  <p className="mb-2 leading-snug">
                    Turn your happiest moments with your pet into a playful caricature!
                  </p>
                  <Link
                    href="/create"
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Start now →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Home
            </Link>
            <Link href="/create" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Create
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Gallery
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Pricing
            </Link>

            <Link href="/create" className="btn-primary">
              Get Started
            </Link>

            <HamburgerMenu user={user} />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <HamburgerMenu user={user} />
          </div>
        </div>
      </nav>
    </header>
  )
}
