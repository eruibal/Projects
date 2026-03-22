import { Shield, MapPin, Mail, Phone, Facebook, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-techaus-primary text-white pt-16 pb-8 border-t border-slate-700" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white text-techaus-primary p-1.5 rounded">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                TEC<span className="text-techaus-accent">HAUS</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Soluciones de protección integral y servicios en la nube. Innovación y seguridad para tu familia y empresa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-techaus-accent transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-techaus-accent transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-techaus-accent transition-colors">
                  Seguros Personales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-techaus-accent transition-colors">
                  Seguros Empresariales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-techaus-accent transition-colors">
                  Cloud Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contacto</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-techaus-accent mt-0.5 flex-shrink-0" />
                <span>
                  Paseo Vista del Lago 27
                  <br />
                  Fracc. Vista del Lago
                  <br />
                  Hermosillo, Sonora
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-techaus-accent flex-shrink-0" />
                <a href="mailto:contacto@techaus.mx" className="hover:text-white">
                  contacto@techaus.mx
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-techaus-accent flex-shrink-0" />
                <a href="tel:+521234567890" className="hover:text-white">
                  +52 (662) 123 4567
                </a>
              </li>
            </ul>
          </div>

          {/* Tags/SEO Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Etiquetas</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                #insurtech
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                #seguros
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                #hermosillo
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                #tecnologia
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                #proteccion
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; 2025 Techaus. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-white">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
