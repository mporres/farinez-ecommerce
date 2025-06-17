"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Opcionalmente, registrar el error en un servicio de análisis
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Algo salió mal</h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={reset} className="bg-orange-600 hover:bg-orange-700">
            Intentar nuevamente
          </Button>
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
