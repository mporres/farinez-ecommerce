"use client"
import { FC, useState, useEffect } from "react"

interface RecetaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  receta?: {
    name: string
    difficulty: string
    time: string
    servings: number
    category: string
    price: string
    image_url: string
    description: string
  } | null
}

export const RecetaModal: FC<RecetaModalProps> = ({ isOpen, onClose, onSave, receta }) => {
  const [name, setName] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [time, setTime] = useState("")
  const [servings, setServings] = useState(1)
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [image_url, setImageUrl] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (receta) {
      setName(receta.name)
      setDifficulty(receta.difficulty)
      setTime(receta.time)
      setServings(receta.servings)
      setCategory(receta.category)
      setPrice(receta.price)
      setImageUrl(receta.image_url)
      setDescription(receta.description)
    } else {
      setName("")
      setDifficulty("")
      setTime("")
      setServings(1)
      setCategory("")
      setPrice("")
      setImageUrl("")
      setDescription("")
    }
  }, [receta])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, difficulty, time, servings, category, price, image: image_url, description })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded shadow-lg z-10 w-11/12 max-w-3xl">
        <h2 className="text-xl font-bold mb-4">{receta ? "Editar Receta" : "Nueva Receta"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Categoría</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Dificultad</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full border p-2 rounded" required>
                <option value="">Seleccione</option>
                <option value="Fácil">Fácil</option>
                <option value="Medio">Medio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Precio</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Tiempo</label>
              <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border p-2 rounded" placeholder="30 min" required />
            </div>
            <div>
              <label className="block text-sm font-medium">URL de Imagen</label>
              <input type="text" value={image_url} onChange={(e) => setImageUrl(e.target.value)} className="w-full border p-2 rounded" placeholder="/img/ejemplo.svg" />
            </div>
            <div>
              <label className="block text-sm font-medium">Porciones</label>
              <input type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} className="w-full border p-2 rounded" min={1} required />
            </div>
            <div>
              <label className="block text-sm font-medium">-</label>
              {/* Espacio reservado para alinear la grilla */}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" rows={3} required></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-300 p-2 rounded">
              Cancelar
            </button>
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 p-2 rounded text-white">
              {receta ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecetaModal
