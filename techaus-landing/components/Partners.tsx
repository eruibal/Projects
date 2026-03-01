import { Building2, Umbrella, Car } from 'lucide-react'

export default function Partners() {
  return (
    <div className="bg-white border-b border-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
          Con el respaldo de las mejores compañías
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-red-600" /> AXA
          </div>
          <div className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <Umbrella className="w-6 h-6 text-orange-500" /> GNP
          </div>
          <div className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <Car className="w-6 h-6 text-purple-600" /> Quálitas
          </div>
          <div className="text-xl font-bold text-slate-500 border border-slate-300 px-2 py-1 rounded">
            CONDUSEF
          </div>
        </div>
      </div>
    </div>
  )
}
