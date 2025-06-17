"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Clock, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"

export default function PaymentPendingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Clock className="w-16 h-16 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl text-yellow-600">Pago pendiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="text-lg mb-4">Tu pago está siendo procesado.</p>
                {paymentId && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>ID de pago:</strong> {paymentId}
                    </p>
                    <p>
                      <strong>Estado:</strong> {status}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Recibirás una notificación cuando el pago sea confirmado. Esto puede tomar unos minutos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/")} className="bg-orange-600 hover:bg-orange-700">
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
                <Button variant="outline" onClick={() => router.push("/productos")}>
                  Seguir comprando
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
