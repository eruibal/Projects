import { Heart, Car, HandshakeIcon, House } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

const services = [
  {
    icon: Heart,
    title: 'Gastos Médicos',
    description: 'Evita un descalabro financiero ante enfermedades o accidentes. Soluciones a la medida de tu salud.',
    cta: 'Saber más',
    borderColor: 'border-techaus-accent',
    iconBg: 'bg-blue-50 group-hover:bg-techaus-accent',
    iconColor: 'text-techaus-accent',
    linkColor: 'text-techaus-accent hover:text-sky-700',
  },
  {
    icon: Car,
    title: 'Seguro de Auto',
    description: 'Protege tu vehículo contra daños, robo y responsabilidad civil con asistencia vial garantizada.',
    cta: 'Cotizar Auto',
    borderColor: 'border-techaus-primary',
    iconBg: 'bg-slate-100 group-hover:bg-techaus-primary',
    iconColor: 'text-techaus-primary',
    linkColor: 'text-techaus-primary hover:text-slate-900',
  },
  {
    icon: HandshakeIcon,
    title: 'Seguro de Vida',
    description: 'Garantiza el futuro económico de tus seres queridos ante cualquier eventualidad.',
    cta: 'Ver opciones',
    borderColor: 'border-techaus-accent',
    iconBg: 'bg-blue-50 group-hover:bg-techaus-accent',
    iconColor: 'text-techaus-accent',
    linkColor: 'text-techaus-accent hover:text-sky-700',
  },
  {
    icon: House,
    title: 'Hogar y Empresa',
    description: 'Tu patrimonio es tu activo más importante. Protégelo contra fenómenos naturales y robos.',
    cta: 'Proteger patrimonio',
    borderColor: 'border-techaus-primary',
    iconBg: 'bg-slate-100 group-hover:bg-techaus-primary',
    iconColor: 'text-techaus-primary',
    linkColor: 'text-techaus-primary hover:text-slate-900',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-techaus-accent font-bold tracking-wide uppercase text-sm mb-3">
            Nuestras Soluciones
          </h2>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-800">
            Protección para lo que más amas
          </h3>
          <div className="w-24 h-1 bg-techaus-accent mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 ${service.borderColor} group`}
              >
                <div
                  className={`w-16 h-16 ${service.iconBg} rounded-full flex items-center justify-center mb-6 group-hover:text-white transition-colors duration-300`}
                >
                  <Icon className={`w-6 h-6 ${service.iconColor} group-hover:text-white`} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{service.description}</p>
                <a href="#" className={`${service.linkColor} font-bold text-sm flex items-center gap-1`}>
                  {service.cta} <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
