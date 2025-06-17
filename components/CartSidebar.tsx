"use client"

import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function CartSidebar() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } = useCart()
  const router = useRouter()

  if (!isOpen) return null

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/carrito")
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
      <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Carrito de Compras</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-orange-600 font-semibold">${item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-orange-600">${total.toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full bg-orange-600 hover:bg-orange-700">
              Finalizar Compra
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
