"use client"
import { FC, useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"

interface RecetaViewModalProps {
  isOpen: boolean
  recetaId: number
  onClose: () => void
}

export const RecetaViewModal: FC<RecetaViewModalProps> = ({ isOpen, recetaId, onClose }) => {
  const [receta, setReceta] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      axios.get(`http://localhost:3000/api/recetas/${recetaId}`)
        .then(response => {
          setReceta(response.data)
        })
        .catch(error => {
          console.error("Error al cargar la receta", error)
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, recetaId])
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded shadow-lg z-10 w-96 max-h-full overflow-y-auto">
        {loading ? (
          <p>Cargando...</p>
        ) : receta ? (
          <>
            <h2 className="text-xl font-bold mb-4">{receta.name}</h2>
            <div className="mb-4">
              <Image
                src={receta.image_url && receta.image_url.trim() !== "" ? receta.image_url : "/placeholder.svg?height=100&width=100&text=Sin+imagen"}
                alt={receta.name}
                width={200}
                height={150}
                className="rounded object-cover"
              />
            </div>
            <p><strong>Dificultad:</strong> {receta.difficulty}</p>
            <p><strong>Tiempo:</strong> {receta.time}</p>
            <p><strong>Porciones:</strong> {receta.servings}</p>
            <p><strong>Categoría:</strong> {receta.category}</p>
            <p><strong>Precio:</strong> {receta.price}</p>
            <p className="mt-2"><strong>Descripción:</strong> {receta.description}</p>
            {/* Se pueden agregar más campos si la API los devuelve */}
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="bg-gray-300 p-2 rounded">Cerrar</button>
            </div>
          </>
        ) : (
          <p>No se pudo cargar la receta.</p>
        )}
      </div>
    </div>
  )
}

export default RecetaViewModal
