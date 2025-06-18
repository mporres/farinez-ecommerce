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
// Importamos react-leaflet para el mapa
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

// Registrar iconos por defecto de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface ShippingAddress {
  name: string
  calleYNumero: string
  pisoDpto: string
  localidad: string
  departamento: string
  provincia: string
  phone: string
}

export default function CartPage() {
  // 1. DECLARACIÓN DE ESTADOS Y HOOKS
  // Estado para costo de envío (asegúrate que esté antes de totalWithShipping)
  const [shippingCost, setShippingCost] = useState<number | null>(null)

  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const subtotal = total

  // Ahora sí total con envío
  const totalWithShipping = subtotal + (shippingCost ?? 0)

  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    calleYNumero: "",
    pisoDpto: "",
    localidad: "",
    departamento: "",
    provincia: "",
    phone: "",
  })
  const [selectedAddress, setSelectedAddress] = useState("new")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [mapError, setMapError] = useState("")
  const [isSelectingMap, setIsSelectingMap] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number } | null>(null)

  useEffect(() => {
    // Se quita temporalmente el check de autenticación
    // if (!isAuthenticated || (isAuthenticated && user?.role !== "cliente")) {
    //   router.push("/login")
    // }
  }, [isAuthenticated, user, router])

  // 2. EFECTO PARA GEOCODIFICAR SELECCIÓN DE FORMULARIO
  useEffect(() => {
    if (
      shippingAddress.calleYNumero &&
      shippingAddress.localidad &&
      shippingAddress.departamento &&
      shippingAddress.provincia
    ) {
      const q = encodeURIComponent(
        `${shippingAddress.calleYNumero}, ${shippingAddress.localidad}, ${shippingAddress.departamento}, ${shippingAddress.provincia}, Argentina`
      )
      fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`)
        .then((res) => res.json())
        .then((results) => {
          if (results.length) {
            const { lat, lon, display_name } = results[0]
            setMarkerPosition({ lat: +lat, lng: +lon })
            const lower = display_name.toLowerCase()
            setShippingCost(lower.includes("mendoza") ? 8900 : 15000)
          }
        })
        .catch((err) => console.error("Geocoding error:", err))
    }
  }, [
    shippingAddress.calleYNumero,
    shippingAddress.localidad,
    shippingAddress.departamento,
    shippingAddress.provincia,
  ])

  // 3. COMPONENTE INTERNO PARA SELECCIÓN MANUAL EN EL MAPA
  function MapSelector() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setMarkerPosition({ lat, lng })
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then((res) => res.json())
          .then((data) => {
            const addr = data.address || {}
            setShippingAddress((prev) => ({
              ...prev,
              address: data.display_name,
              localidad: addr.city || prev.localidad,
              departamento: addr.state_district || prev.departamento,
              provincia: addr.state || prev.provincia,
            }))
            const lower = (data.display_name || "").toLowerCase()
            setShippingCost(
              !addr.country || addr.country.toLowerCase() !== "argentina"
                ? 0
                : lower.includes("mendoza")
                ? 8900
                : 15000
            )
          })
          .catch((err) => {
            console.error("Reverse geocoding:", err)
            setMapError("No se pudo determinar la ubicación")
          })
      },
    })
    return markerPosition ? <Marker position={markerPosition} /> : null
  }

  // Actualiza un campo del objeto shippingAddress
  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Avanza al siguiente paso
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Retrocede al paso anterior
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Maneja la creación de preferencia en Mercado Pago
  const createMercadoPagoPreference = async () => {
    setIsProcessingPayment(true)
    try {
      const response = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            title: item.name,
            quantity: item.quantity,
            unit_price: Number(item.price),   // ← Convertir explícito a número
            currency_id: "ARS",
          })),
          shipping_cost: shippingCost ?? 0,
          total: totalWithShipping,
        }),
      })

      const data = await response.json()
      console.log("MP pref res status:", response.status, "body:", data)

      // Prioridad a init_point, luego sandbox_init_point
      const url = data.init_point ?? data.sandbox_init_point
      if (url) {
        window.location.href = url
      } else {
        const errMsg = data.error || "no disponible"
        console.error("Preferencia MP sin URL:", errMsg)
        alert(`Error al crear preferencia de pago: ${errMsg}`)
      }
    } catch (err: any) {
      console.error("Excepción en MP pref:", err)
      alert("Error al procesar el pago. Intenta nuevamente.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // 4. RENDERIZADO DE PASOS
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
            {/* Se elimina el RadioGroup para dejar siempre el formulario */}
            <div className="mt-4 space-y-4">
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
              <div>
                <Label htmlFor="calleYNumero">Calle, número/altura</Label>
                <Input
                  id="calleYNumero"
                  value={shippingAddress.calleYNumero}
                  onChange={(e) => handleAddressChange("calleYNumero", e.target.value)}
                  placeholder="Av. Corrientes 1234"
                />
              </div>
              <div>
                <Label htmlFor="pisoDpto">Piso, Dpto</Label>
                <Input
                  id="pisoDpto"
                  value={shippingAddress.pisoDpto}
                  onChange={(e) => handleAddressChange("pisoDpto", e.target.value)}
                  placeholder="Piso 5, Depto A"
                />
              </div>
              <div>
                <Label htmlFor="localidad">Localidad</Label>
                <Input
                  id="localidad"
                  value={shippingAddress.localidad}
                  onChange={(e) => handleAddressChange("localidad", e.target.value)}
                  placeholder="Localidad"
                />
              </div>
              <div>
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  value={shippingAddress.departamento}
                  onChange={(e) => handleAddressChange("departamento", e.target.value)}
                  placeholder="Departamento"
                />
              </div>
              <div>
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  value={shippingAddress.provincia}
                  onChange={(e) => handleAddressChange("provincia", e.target.value)}
                  placeholder="Provincia"
                />
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={() => setIsSelectingMap(prev => !prev)}>
                  Seleccionar punto en el mapa
                </Button>
              </div>
              {isSelectingMap && (
                <div className="mt-4 h-64 w-full">
                  <MapContainer center={markerPosition || [-32.8895, -68.8458]} zoom={8} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapSelector />
                  </MapContainer>
                </div>
              )}
              {mapError && <p className="text-red-500 mt-2">{mapError}</p>}
              {shippingCost !== null && shippingCost > 0 && (
                <p className="mt-2">Costo de envío calculado: ${shippingCost}</p>
              )}
            </div>
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
                    <p>{shippingAddress.calleYNumero}</p>
                    <p>
                      {shippingAddress.localidad}, {shippingAddress.departamento}
                    </p>
                    <p>{shippingAddress.phone}</p>
                    {shippingCost !== null && shippingCost > 0 && (
                      <p className="mt-2 font-semibold">Envío: ${shippingCost}</p>
                    )}
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
                        {/* Suponiendo que para direcciones guardadas se tenga ya un costo asignado */}
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
  } // <- cierra renderStepContent

  const steps = [
    { number: 1, title: "Revisar pedido", icon: Package },
    { number: 2, title: "Dirección", icon: MapPin },
    { number: 3, title: "Pagar", icon: CreditCard },
  ]

  // 5. RETURN PRINCIPAL: aquí se arma toda la UI
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      {/* Contenedor principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb y barra de progreso */}
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

        {/* Grid de pasos + resumen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna de contenido (pasos) */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>

          {/* Columna de resumen de pedido */}
          <div>
            <Card>
              <CardContent className="space-y-4">
                {/* 5.1 Lista de items */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* 5.2 Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* 5.3 Envío (si está calculado) */}
                {shippingCost !== null ? (
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>${shippingCost}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>--</span>
                  </div>
                )}

                <Separator />

                {/* 5.4 Total */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">${totalWithShipping.toFixed(2)}</span>
                </div>

                {/* 5.5 Botones de navegación */}
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
                      disabled={currentStep === 2 && selectedAddress === "new" && shippingCost === null}
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

                {/* 5.6 Pie de seguridad */}
                <div className="text-xs text-gray-500 text-center">
                  <Badge variant="secondary" className="mb-2">Compra segura</Badge>
                  <p>Tus datos están protegidos con encriptación SSL</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} // <- Cierra CartPage
