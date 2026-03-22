import Image from 'next/image'

const leaders = [
  {
    name: 'Elena Rodríguez',
    role: 'CEO & Founder',
    bio: 'Con más de 15 años de experiencia en el sector tecnológico y asegurador, Elena fundó TechAus con la visión de modernizar la protección empresarial. Es licenciada en Administración y Finanzas, y una apasionada de la transformación digital.',
  },
  {
    name: 'Carlos Mendoza',
    role: 'CTO (Chief Technology Officer)',
    bio: 'Arquitecto principal de nuestra plataforma en la nube y experto en ciberseguridad. Carlos lidera el equipo de ingeniería para asegurar que nuestra infraestructura sea robusta, escalable y esté blindada contra cualquier amenaza.',
  },
  {
    name: 'Andrés Silva',
    role: 'VP de Operaciones',
    bio: 'Especialista en optimización de procesos y experiencia del cliente. Andrés garantiza que cada solución que entregamos supere las expectativas y se ejecute sin contratiempos, manteniendo siempre un enfoque centrado en las personas.',
  }
]

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Conoce al equipo que lidera la innovación y la protección en TechAus.
          </p>
        </div>

        {/* Team Photo */}
        <div className="relative w-full h-[400px] md:h-[500px] mb-20 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/images/team_leadership.png"
            alt="El Equipo Directivo de TechAus"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h2 className="text-3xl font-bold text-white">Nuestro Liderazgo</h2>
            <p className="text-slate-200 mt-2">Comprometidos con tu seguridad</p>
          </div>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {leaders.map((leader, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-techaus-accent font-bold text-2xl mb-6">
                {leader.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{leader.name}</h3>
              <p className="text-techaus-primary font-semibold text-sm uppercase tracking-wide mb-4">{leader.role}</p>
              <p className="text-slate-600 leading-relaxed">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
