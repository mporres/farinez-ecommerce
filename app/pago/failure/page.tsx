"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { XCircle, ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"

export default function PaymentFailurePage() {
  const router = useRouter()
  const params = useSearchParams()
  const paymentId = params.get("payment_id")
  const status = params.get("status")
  const merchantOrderId = params.get("merchant_order_id")
  const errorMessage = params.get("error_message") // posible mensaje adicional

  // Nuevos parámetros de sandbox
  const preferenceId = params.get("preference-id")
  const routerRequestId = params.get("router-request-id")
  const pParam = params.get("p")
  const payWithCash = params.get("pay_with_cash")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-600">Algo salió mal...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg mb-4">No pudimos procesar tu pago.</p>

              <div className="bg-gray-50 p-4 rounded-lg text-left">
                {paymentId && (
                  <p>
                    <strong>ID de pago:</strong> {paymentId}
                  </p>
                )}
                {status && (
                  <p>
                    <strong>Estado:</strong> {status}
                  </p>
                )}
                {merchantOrderId && (
                  <p>
                    <strong>Orden (merchant_order_id):</strong> {merchantOrderId}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-sm text-red-700 mt-2">
                    <strong>Detalle:</strong> {errorMessage}
                  </p>
                )}

                {/* Parámetros extra de sandbox */}
                {preferenceId && (
                  <p>
                    <strong>Preference ID:</strong> {preferenceId}
                  </p>
                )}
                {routerRequestId && (
                  <p>
                    <strong>Router Request ID:</strong> {routerRequestId}
                  </p>
                )}
                {pParam && (
                  <p>
                    <strong>Parámetro p:</strong> {pParam}
                  </p>
                )}
                {payWithCash && (
                  <p>
                    <strong>Pago en efectivo:</strong> {payWithCash === "true" ? "Sí" : "No"}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Revisa que tu carrito esté completo y los importes sean correctos.
              </p>
              <p className="text-sm text-gray-500">
                Si el problema persiste, prueba otro método de pago o contáctanos con el código de falla.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/carrito")} className="bg-orange-600 hover:bg-orange-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Intentar nuevamente
                </Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
