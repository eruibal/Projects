import Image from 'next/image'
import Link from 'next/link'

export default function CloudServices() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            Cloud Services
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Soluciones de infraestructura en la nube para escalar y asegurar el futuro de tu negocio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/cloud_services_hero.png"
              alt="Cloud Services by TechAus"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Transformación Digital a tu Alcance</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              En TechAus, ofrecemos servicios de computación en la nube diseñados para maximizar la disponibilidad, 
              seguridad y el rendimiento de tus aplicaciones y datos.
            </p>
            <ul className="space-y-4 text-slate-600 list-inside">
              <li className="flex items-start">
                <span className="text-techaus-accent mr-3 mt-1">✓</span>
                Migración de infraestructura y modernización de aplicaciones.
              </li>
              <li className="flex items-start">
                <span className="text-techaus-accent mr-3 mt-1">✓</span>
                Almacenamiento escalable y copias de seguridad continuas.
              </li>
              <li className="flex items-start">
                <span className="text-techaus-accent mr-3 mt-1">✓</span>
                Administración de redes y despliegue de soluciones híbridas.
              </li>
              <li className="flex items-start">
                <span className="text-techaus-accent mr-3 mt-1">✓</span>
                Seguridad de nivel empresarial para proteger tu información.
              </li>
            </ul>
            <div className="pt-6">
              <Link
                href="/cotizar"
                className="inline-block bg-techaus-accent hover:bg-sky-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-sky-300/50"
              >
                Solicitar una Cotización
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
