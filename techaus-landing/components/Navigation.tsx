'use client'

import { useState } from 'react'
import { Menu, X, Umbrella } from 'lucide-react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="bg-techaus-primary text-white p-2 rounded-lg">
              <Umbrella className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl text-techaus-primary tracking-tight">
              TECH<span className="text-techaus-accent">AUS</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#" className="text-slate-700 hover:text-techaus-accent font-semibold text-sm uppercase tracking-wide transition-colors">
              Protección
            </a>
            <a href="#" className="text-slate-700 hover:text-techaus-accent font-semibold text-sm uppercase tracking-wide transition-colors">
              Cloud Services
            </a>
            <a href="#" className="text-slate-700 hover:text-techaus-accent font-semibold text-sm uppercase tracking-wide transition-colors">
              Nosotros
            </a>
            <a
              href="#contact"
              className="bg-techaus-accent hover:bg-sky-600 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg hover:shadow-sky-300/50 transform hover:-translate-y-0.5"
            >
              Cotizar Ahora
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-techaus-accent focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="#" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-techaus-accent hover:bg-slate-50 rounded-md">
              Protección
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-techaus-accent hover:bg-slate-50 rounded-md">
              Cloud Services
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-techaus-accent hover:bg-slate-50 rounded-md">
              Nosotros
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
