"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

interface ProductDetail {
  id: string
  name: string
  price: string
  category: string
  stock: number
  description: string
  image_url: string
}

interface ProductViewModalProps {
  isOpen: boolean
  productId: string
  onClose: () => void
}

export function ProductViewModal({ isOpen, productId, onClose }: ProductViewModalProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`http://localhost:3000/api/productos/${productId}`)
        .then((response) => {
          setProduct(response.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setError("Error al cargar el producto")
          setLoading(false)
        })
    }
  }, [productId, isOpen])

  return (
    <div className={`${isOpen ? "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" : "hidden"}`}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-50">
        <div className="flex items-center justify-between p-6 border-b">
          <CardTitle className="text-xl font-semibold">Detalle del Producto</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardContent className="p-6">
          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : product ? (
            <div className="space-y-4">
              <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover rounded" />
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p><span className="font-semibold">Precio:</span> ${product.price}</p>
              <p><span className="font-semibold">Categoría:</span> {product.category}</p>
              <p><span className="font-semibold">Stock:</span> {product.stock} unidades</p>
              <p><span className="font-semibold">Descripción:</span> {product.description}</p>
            </div>
          ) : null}
        </CardContent>
      </div>
    </div>
  )
}
