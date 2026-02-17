"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DeleteAccountPage() {
  const [formData, setFormData] = useState({
    email: "",
    reason: "",
    password: "",
    confirmation: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-clash font-bold text-3xl mb-4 text-gray-900">Solicitud Recibida</h1>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Hemos recibido tu solicitud de eliminación de cuenta. Procesaremos tu petición en las próximas 24-48
              horas. Recibirás un correo electrónico de confirmación una vez que tu cuenta haya sido eliminada.
            </p>
            <p className="text-gray-600 mb-8 text-sm">
              Si cambias de opinión, puedes contactarnos en <strong>weincardco@gmail.com</strong> antes de que se complete
              la eliminación.
            </p>
            <Link href="/">
              <Button className="bg-[#FF3B47] hover:bg-[#FF3B47]/90 text-white px-8">Volver al Inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <header className="bg-black py-6">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Image src="/logo-weincard.png" alt="Weincard Logo" width={150} height={40} className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="font-clash font-bold text-3xl md:text-4xl mb-4 text-gray-900">Eliminar Cuenta</h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Lamentamos que desees eliminar tu cuenta de Weincard. Una vez que envíes esta solicitud, tu cuenta y toda la
            información asociada serán eliminadas permanentemente.
          </p>

          {/* Warning Box */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Esta acción es irreversible</h3>
                <p className="text-sm text-red-700 mt-1">
                  Se eliminarán todos tus datos, beneficios acumulados, historial de transacciones y descuentos
                  asociados a tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                placeholder="Tu contraseña actual"
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de eliminación <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition bg-white"
              >
                <option value="">Selecciona un motivo</option>
                <option value="no-uso">No uso la aplicación</option>
                <option value="privacidad">Preocupaciones de privacidad</option>
                <option value="otra-app">Prefiero otra aplicación</option>
                <option value="experiencia">Mala experiencia de usuario</option>
                <option value="restaurantes">Pocos restaurantes disponibles</option>
                <option value="otro">Otro motivo</option>
              </select>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="confirmation"
                name="confirmation"
                required
                checked={formData.confirmation}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-[#FF3B47] focus:ring-[#FF3B47] border-gray-300 rounded"
              />
              <label htmlFor="confirmation" className="ml-3 text-sm text-gray-700">
                Confirmo que entiendo que esta acción eliminará permanentemente mi cuenta y todos los datos asociados,
                incluyendo beneficios acumulados y descuentos. <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#FF3B47] hover:bg-[#FF3B47]/90 text-white"
              >
                {isLoading ? "Procesando..." : "Eliminar mi cuenta"}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              ¿Necesitas ayuda? Contacta con nuestro equipo de soporte en{" "}
              <a href="mailto:weincardco@gmail.com" className="text-[#FF3B47] hover:underline">
                weincardco@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2026 Weincard. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
