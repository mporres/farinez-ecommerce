"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Package, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { useCart } from "@/contexts/CartContext"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const merchantOrderId = searchParams.get("merchant_order_id")

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    if (status === "approved") {
      clearCart()
    }
  }, [status, clearCart])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">¡Pago exitoso!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="text-lg mb-4">Tu pedido ha sido procesado correctamente.</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <strong>ID de pago:</strong> {paymentId}
                  </p>
                  <p>
                    <strong>Estado:</strong> {status}
                  </p>
                  {merchantOrderId && (
                    <p>
                      <strong>Orden:</strong> {merchantOrderId}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <Package className="w-5 h-5" />
                  <span>Recibirás un email con los detalles de tu pedido</span>
                </div>
                <p className="text-sm text-gray-500">El tiempo estimado de entrega es de 3-5 días hábiles.</p>
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
