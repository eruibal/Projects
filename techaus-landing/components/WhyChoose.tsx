import { Check } from 'lucide-react'
import Image from 'next/image'

export default function WhyChoose() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-techaus-accent/20 rounded-2xl transform -rotate-3"></div>
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              alt="Team working"
              width={600}
              height={600}
              className="relative rounded-2xl shadow-2xl w-full"
            />

            {/* Floating Stat Card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Clientes Satisfechos</p>
                  <p className="text-2xl font-bold text-slate-800">+800 Familias</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-techaus-accent font-bold tracking-wide uppercase text-sm mb-3">
              Por qué elegir Techaus
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 mb-6">
              Tecnología y calidez humana en un solo lugar.
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              No solo vendemos seguros; creamos estrategias de protección personalizadas. Combinamos la facilidad de la tecnología con la asesoría experta que necesitas en momentos críticos.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-techaus-accent mt-1 flex-shrink-0" />
                <span className="text-slate-700">Asesoría legal y asistencia vial en México y el extranjero.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-techaus-accent mt-1 flex-shrink-0" />
                <span className="text-slate-700">Respaldo de las aseguradoras más sólidas del país.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-techaus-accent mt-1 flex-shrink-0" />
                <span className="text-slate-700">Gestión digital rápida y eficiente.</span>
              </li>
            </ul>

            <a
              href="#contact"
              className="inline-block bg-techaus-primary hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Conocer al equipo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
