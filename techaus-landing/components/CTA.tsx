export default function CTA() {
  return (
    <section className="bg-techaus-accent py-20 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-techaus-primary/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
          ¿Listo para asegurar tu futuro?
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Te ayudamos a hacer negocios fácil y rápido, con mejores resultados. Solicita una cotización sin compromiso hoy mismo.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-techaus-accent font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-slate-100 transition-colors">
            Hablar con un asesor
          </button>
          <button className="bg-techaus-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-slate-800 transition-colors">
            Cotizar en línea
          </button>
        </div>
      </div>
    </section>
  )
}
