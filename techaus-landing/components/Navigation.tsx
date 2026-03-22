'use client'

import { useState } from 'react'
import { Menu, X, Umbrella, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileProteccionOpen, setMobileProteccionOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="bg-techaus-primary text-white p-2 rounded-lg">
              <Umbrella className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl text-techaus-primary tracking-tight">
              TECH<span className="text-techaus-accent">AUS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-700 hover:text-techaus-accent font-semibold text-sm uppercase tracking-wide transition-colors py-2">
                Protección <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/proteccion/gastos-medicos" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-techaus-accent">Gastos Médicos</Link>
                  <Link href="/proteccion/seguro-de-auto" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-techaus-accent">Seguro de Auto</Link>
                  <Link href="/proteccion/seguro-de-vida" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-techaus-accent">Seguro de Vida</Link>
                  <Link href="/proteccion/hogar-y-empresa" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-techaus-accent">Hogar y Empresa</Link>
                </div>
              </div>
            </div>
            <Link href="/cloud-services" className="text-slate-700 hover:text-techaus-accent font-semibold text-sm uppercase tracking-wide transition-colors">
              Cloud Services
            </Link>
            <Link href="/nosotros" className="text-slate-700 hover:text-techaus-accent font-semibold text-sm uppercase tracking-wide transition-colors">
              Nosotros
            </Link>
            <Link
              href="/cotizar"
              className="bg-techaus-accent hover:bg-sky-600 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg hover:shadow-sky-300/50 transform hover:-translate-y-0.5"
            >
              Cotizar Ahora
            </Link>
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
        <div className="md:hidden bg-white border-t border-slate-100 max-h-[calc(100vh-5rem)] overflow-y-auto w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <div>
              <button
                onClick={() => setMobileProteccionOpen(!mobileProteccionOpen)}
                className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-slate-700 hover:text-techaus-accent hover:bg-slate-50 rounded-md"
              >
                Protección <ChevronDown className={`w-5 h-5 transition-transform ${mobileProteccionOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileProteccionOpen && (
                <div className="pl-6 pr-3 py-2 space-y-2 border-l-2 border-slate-100 ml-4 mt-1">
                  <Link href="/proteccion/gastos-medicos" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 hover:text-techaus-accent">Gastos Médicos</Link>
                  <Link href="/proteccion/seguro-de-auto" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 hover:text-techaus-accent">Seguro de Auto</Link>
                  <Link href="/proteccion/seguro-de-vida" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 hover:text-techaus-accent">Seguro de Vida</Link>
                  <Link href="/proteccion/hogar-y-empresa" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 hover:text-techaus-accent">Hogar y Empresa</Link>
                </div>
              )}
            </div>
            <Link href="/cloud-services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-techaus-accent hover:bg-slate-50 rounded-md">
              Cloud Services
            </Link>
            <Link href="/nosotros" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-techaus-accent hover:bg-slate-50 rounded-md">
              Nosotros
            </Link>
            <div className="pt-4 pb-2 border-t border-slate-100">
              <Link
                href="/cotizar"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-techaus-accent hover:bg-sky-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg"
              >
                Cotizar Ahora
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
