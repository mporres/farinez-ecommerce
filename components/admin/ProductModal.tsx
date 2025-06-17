"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  stock: number
  brand: string
  description: string
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<Product, "id">) => void
  product?: Product | null
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const initialFormState = {
    name: product?.name ?? "",
    price: product ? product.price.toString() : "",
    category: product?.category ?? "",
    stock: product ? product.stock.toString() : "",
    description: product?.description ?? "",
    image: product?.image ?? "",
    // brand: product?.brand ?? "",
  }
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    setFormData({
      name: product?.name ?? "",
      price: product ? product.price.toString() : "",
      category: product?.category ?? "",
      stock: product ? product.stock.toString() : "",
      description: product?.description ?? "",
      image: product?.image ?? "",
      // brand: product?.brand ?? "",
    })
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseFloat(formData.price)
    if (isNaN(priceNum)) {
      alert("El precio debe ser un número válido")
      return
    }
    const payload = {
      name: formData.name,
      price: priceNum.toFixed(2),
      category: formData.category,
      stock: formData.stock,
      description: formData.description,
      image_url: formData.image,
    }
    try {
      const response = await axios.post("http://localhost:3000/api/productos", payload, {
        headers: { "Content-Type": "application/json" },
      })
      onSave(response.data)
    } catch (error) {
      console.error("Error al crear producto", error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{product ? "Editar Producto" : "Nuevo Producto"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del producto</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dulces">Dulces</SelectItem>
                  <SelectItem value="Harinas">Harinas</SelectItem>
                  <SelectItem value="Panadería">Panadería</SelectItem>
                  <SelectItem value="Pastas">Pastas</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">URL de la imagen</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="/placeholder.svg?height=200&width=200&text=Producto"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {product ? "Actualizar" : "Crear"} Producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
