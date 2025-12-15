'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import HamburgerMenu from './HamburgerMenu'

interface HeaderProps {
  user?: any
}

export default function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-coral-500 bg-clip-text text-transparent">
              PetiBoo
            </div>
          </Link>

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
