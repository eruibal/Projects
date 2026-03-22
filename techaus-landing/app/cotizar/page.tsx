'use client'

import { useState } from 'react'

export default function Cotizar() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
  })
  
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would normally send to an API. 
    // For the demo, we just show success.
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800">
          Solicita tu Cotización
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Ingresa tus datos y un asesor se comunicará contigo.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {submitted ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400 text-2xl">✓</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Cotización Solicitada</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Gracias por tu interés, {formData.name}. Hemos recibido tu solicitud. Nuestro equipo te contactará a la brevedad posible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Nombre Completo
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-techaus-accent focus:border-techaus-accent sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Correo Electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-techaus-accent focus:border-techaus-accent sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Teléfono
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-techaus-accent focus:border-techaus-accent sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700">
                  Servicio de Interés
                </label>
                <div className="mt-1">
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-techaus-accent focus:border-techaus-accent sm:text-sm rounded-md"
                  >
                    <option value="" disabled>Selecciona un servicio</option>
                    <option value="Gastos Médicos">Gastos Médicos</option>
                    <option value="Seguro de Auto">Seguro de Auto</option>
                    <option value="Seguro de Vida">Seguro de Vida</option>
                    <option value="Hogar y Empresa">Hogar y Empresa</option>
                    <option value="Cloud Services">Cloud Services</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-techaus-accent hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techaus-accent transition-colors"
                >
                  Iniciar Cotización
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
