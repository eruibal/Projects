import { ArrowRight, ShieldPlus } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <header className="relative bg-techaus-dark pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden clip-diagonal">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Family-protection.png"
          alt="Insurance Protection"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="hero-overlay absolute inset-0"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-techaus-accent/20 text-techaus-accent text-sm font-bold tracking-wider mb-4 border border-techaus-accent/30 uppercase">
            Compromiso Techaus <ShieldPlus className="w-4 h-4 inline-block" />
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
            Protección integral con el respaldo de{' '}
            <span className="text-techaus-accent">profesionales</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Iniciemos con lo más importante: el cuidado de tu salud y de tu familia. Soluciones a la medida de tus necesidades y posibilidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#services"
              className="bg-techaus-accent hover:bg-sky-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-sky-500/50 flex items-center justify-center gap-2"
            >
              Ver Soluciones <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-techaus-dark px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
            >
              Contáctanos
            </a>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative hidden lg:block">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-techaus-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
            <Image
              src="/images/Family-protection.png"
              alt="Family Protection"
              width={600}
              height={600}
              className="relative rounded-2xl shadow-2xl border-4 border-white/10 transform rotate-2 hover:rotate-0 transition-all duration-500"
            />
            
            {/* Floating Medal Badge (Attached to Image) */}
            <div className="absolute -bottom-6 -right-6 z-50 flex flex-col items-center group cursor-pointer animate-float hidden md:flex scale-[0.80] origin-center">
              <a href="#data-vigia" className="relative flex justify-center items-center">
                {/* Ribbons */}
                <div className="absolute -bottom-8 flex gap-2 z-0">
                  <div className="w-6 h-14 bg-red-800 transform rotate-12 origin-top rounded-b-sm shadow-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                  <div className="w-6 h-14 bg-red-900 transform -rotate-12 origin-top rounded-b-sm shadow-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                </div>
                
                {/* Starburst badge effect */}
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 absolute rotate-0 rounded-lg group-hover:rotate-[45deg] transition-transform duration-700 shadow-[0_0_30px_rgba(220,38,38,0.5)] z-10"></div>
                <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-700 absolute rotate-[30deg] rounded-lg group-hover:rotate-[75deg] transition-transform duration-700 z-10"></div>
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 absolute rotate-[60deg] rounded-lg group-hover:rotate-[105deg] transition-transform duration-700 z-10"></div>
                
                {/* Inner circle */}
                <div className="w-28 h-28 bg-gradient-to-br from-red-600 to-red-800 rounded-full absolute z-20 flex flex-col items-center justify-center border-2 border-yellow-400/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.5),0_0_10px_rgba(0,0,0,0.3)]">
                  <span className="text-white font-heading font-bold text-[13px] uppercase leading-tight text-center drop-shadow-lg tracking-wider group-hover:scale-105 transition-transform duration-300">Obtener<br/>Data<br/>Vigia</span>
                </div>
                
                {/* Spacer wrapper to maintain size */}
                <div className="w-32 h-32 relative z-30"></div> 
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
