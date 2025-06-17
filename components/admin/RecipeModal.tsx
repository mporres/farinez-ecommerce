"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Recipe {
  id: string
  name: string
  difficulty: string
  time: string
  servings: number
  category: string
  price: number
  image: string
  description: string
}

interface RecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (recipe: Omit<Recipe, "id">) => void
  recipe?: Recipe | null
}

export function RecipeModal({ isOpen, onClose, onSave, recipe }: RecipeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    difficulty: "",
    time: "",
    servings: 1,
    category: "",
    price: 0,
    image: "",
    description: "",
  })

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        difficulty: recipe.difficulty,
        time: recipe.time,
        servings: recipe.servings,
        category: recipe.category,
        price: recipe.price,
        image: recipe.image,
        description: recipe.description,
      })
    } else {
      setFormData({
        name: "",
        difficulty: "",
        time: "",
        servings: 1,
        category: "",
        price: 0,
        image: "",
        description: "",
      })
    }
  }, [recipe])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{recipe ? "Editar Receta" : "Nueva Receta"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la receta</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Desayuno">Desayuno</SelectItem>
                  <SelectItem value="Almuerzo">Almuerzo</SelectItem>
                  <SelectItem value="Postre">Postre</SelectItem>
                  <SelectItem value="Panadería">Panadería</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="time">Tiempo de preparación</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                placeholder="30 min"
                required
              />
            </div>
            <div>
              <Label htmlFor="servings">Porciones</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => handleChange("servings", Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Precio ingredientes</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
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
              placeholder="/placeholder.svg?height=200&width=200&text=Receta"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {recipe ? "Actualizar" : "Crear"} Receta
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
