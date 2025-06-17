"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ArrowRight, MapPin, CreditCard, Package, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Header } from "@/components/Header"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"

const SHIPPING_COST = 500

interface ShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  phone: string
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  })
  const [selectedAddress, setSelectedAddress] = useState("new")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Direcciones guardadas (simuladas)
  const savedAddresses = [
    {
      id: "1",
      name: "Casa",
      fullAddress: "Av. Corrientes 1234, CABA, 1043",
      phone: "+54 11 1234-5678",
    },
    {
      id: "2",
      name: "Trabajo",
      fullAddress: "Florida 537, CABA, 1005",
      phone: "+54 11 8765-4321",
    },
  ]

  useEffect(() => {
    // Se quita temporalmente el check de autenticación
    // if (!isAuthenticated || (isAuthenticated && user?.role !== "cliente")) {
    //   router.push("/login")
    // }
  }, [isAuthenticated, user, router])

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Agrega algunos productos para continuar con tu compra.</p>
          <Button onClick={() => router.push("/productos")} className="bg-orange-600 hover:bg-orange-700">
            Ver productos
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = total
  const totalWithShipping = subtotal + SHIPPING_COST

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const isAddressValid = () => {
    if (selectedAddress !== "new") return true
    return Object.values(shippingAddress).every((value) => value.trim() !== "")
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const createMercadoPagoPreference = async () => {
    setIsProcessingPayment(true)

    try {
      const response = await fetch("/api/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            title: item.name, // Cambiado de name a title
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: "ARS",
          })),
          shipping_cost: SHIPPING_COST,
          total: totalWithShipping,
        }),
      })

      const data = await response.json()

      if (data.init_point) {
        // Redirigir a Mercado Pago
        window.location.href = data.init_point
      } else {
        throw new Error("Error al crear la preferencia de pago")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar el pago. Por favor, intenta nuevamente.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Revisar tu pedido</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-orange-600 font-bold">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Dirección de envío</h2>

            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
              {savedAddresses.map((address) => (
                <div key={address.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-semibold">{address.name}</p>
                      <p className="text-gray-600">{address.fullAddress}</p>
                      <p className="text-gray-600">{address.phone}</p>
                    </div>
                  </Label>
                </div>
              ))}

              <div className="flex items-start space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="new" id="new" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="new" className="font-semibold cursor-pointer">
                    Nueva dirección
                  </Label>
                  {selectedAddress === "new" && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input
                            id="name"
                            value={shippingAddress.name}
                            onChange={(e) => handleAddressChange("name", e.target.value)}
                            placeholder="Juan Pérez"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            value={shippingAddress.phone}
                            onChange={(e) => handleAddressChange("phone", e.target.value)}
                            placeholder="+54 11 1234-5678"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          value={shippingAddress.address}
                          onChange={(e) => handleAddressChange("address", e.target.value)}
                          placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Ciudad</Label>
                          <Input
                            id="city"
                            value={shippingAddress.city}
                            onChange={(e) => handleAddressChange("city", e.target.value)}
                            placeholder="CABA"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Código postal</Label>
                          <Input
                            id="postalCode"
                            value={shippingAddress.postalCode}
                            onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                            placeholder="1043"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Confirmar y pagar</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Dirección de envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAddress === "new" ? (
                  <div>
                    <p className="font-semibold">{shippingAddress.name}</p>
                    <p>{shippingAddress.address}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.postalCode}
                    </p>
                    <p>{shippingAddress.phone}</p>
                  </div>
                ) : (
                  <div>
                    {savedAddresses.find((addr) => addr.id === selectedAddress) && (
                      <>
                        <p className="font-semibold">
                          {savedAddresses.find((addr) => addr.id === selectedAddress)?.name}
                        </p>
                        <p>{savedAddresses.find((addr) => addr.id === selectedAddress)?.fullAddress}</p>
                        <p>{savedAddresses.find((addr) => addr.id === selectedAddress)?.phone}</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Método de pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Image
                    src="/placeholder.svg?height=30&width=100&text=Mercado+Pago"
                    alt="Mercado Pago"
                    width={100}
                    height={30}
                    className="rounded"
                  />
                  <span>Pago seguro con Mercado Pago</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Podrás pagar con tarjeta de crédito, débito, efectivo o transferencia bancaria.
                </p>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const steps = [
    { number: 1, title: "Revisar pedido", icon: Package },
    { number: 2, title: "Dirección", icon: MapPin },
    { number: 3, title: "Pagar", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </nav>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentStep >= step.number ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`ml-2 font-medium ${currentStep >= step.number ? "text-orange-600" : "text-gray-600"}`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 ${currentStep > step.number ? "bg-orange-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">{renderStepContent()}</CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>${SHIPPING_COST.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">${totalWithShipping.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 space-y-2">
                    {currentStep > 1 && (
                      <Button variant="outline" onClick={handlePrevStep} className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Anterior
                      </Button>
                    )}

                    {currentStep < 3 ? (
                      <Button
                        onClick={handleNextStep}
                        disabled={currentStep === 2 && !isAddressValid()}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={createMercadoPagoPreference}
                        disabled={isProcessingPayment}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        {isProcessingPayment ? "Procesando..." : "Pagar con Mercado Pago"}
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    <Badge variant="secondary" className="mb-2">
                      Compra segura
                    </Badge>
                    <p>Tus datos están protegidos con encriptación SSL</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
