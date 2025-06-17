"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { RecetaModal } from "@/components/admin/RecetaModal"
import { RecetaViewModal } from "@/components/admin/RecetaViewModal"
import axios from "axios"
import Image from "next/image"

interface Receta {
  id: number
  name: string
  difficulty: string
  time: string
  servings: number
  category: string
  price: string
  image_url: string
  description: string
}

export default function AdminRecetasPage() {
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReceta, setEditingReceta] = useState<Receta | null>(null)
  const [viewRecetaId, setViewRecetaId] = useState<string>("")
  const submittedRef = useRef(false)

  useEffect(() => {
    loadRecetas()
  }, [])

  const loadRecetas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/recetas")
      setRecetas(response.data)
    } catch (error) {
      console.error("Error al cargar recetas", error)
    }
  }

  const filteredRecetas = recetas.filter(
    (receta) =>
      receta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receta.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receta.difficulty || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (receta: Receta) => {
    setEditingReceta(receta)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta receta?")) {
      try {
        await axios.delete(`http://localhost:3000/api/recetas/${id}`)
        await loadRecetas()
      } catch (error: any) {
        const errMsg = error.response?.data?.error || error.message
        console.error("Error al eliminar la receta", errMsg)
        alert(`Error al eliminar la receta: ${errMsg}`)
      }
    }
  }

  const updateReceta = async (data: Omit<Receta, "id">) => {
    const payload = { ...data }
    await axios.put(`http://localhost:3000/api/recetas/${editingReceta!.id}`, payload, {
      headers: { "Content-Type": "application/json" },
    })
    await loadRecetas()
  }

  const createReceta = async (data: Omit<Receta, "id">) => {
    const payload = { ...data }
    const response = await axios.post("http://localhost:3000/api/recetas", payload, {
      headers: { "Content-Type": "application/json" },
    })
    await loadRecetas()
    return response.data
  }

  const handleSave = async (recetaData: Omit<Receta, "id">) => {
    if (submittedRef.current) return
    submittedRef.current = true

    if (editingReceta) {
      try {
        await updateReceta(recetaData)
      } catch (error: any) {
        const errMsg = error.response?.data?.error || error.message
        console.error("Error al actualizar la receta", errMsg)
        alert(`Error al actualizar la receta: ${errMsg}`)
      }
    } else {
      const duplicate = recetas.find(
        (r) =>
          r.name === recetaData.name &&
          r.category === recetaData.category &&
          r.difficulty === recetaData.difficulty,
      )
      if (duplicate) {
        alert("La receta ya existe, no se creará de nuevo")
        submittedRef.current = false
        setIsModalOpen(false)
        setEditingReceta(null)
        return
      }
      try {
        await createReceta(recetaData)
      } catch (error: any) {
        const errMsg = error.response?.data?.error || error.message
        console.error("Error al crear la receta", errMsg)
        alert(`Error al crear la receta: ${errMsg}`)
      }
    }
    submittedRef.current = false
    setIsModalOpen(false)
    setEditingReceta(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recetas</h1>
            <p className="text-gray-600">Gestiona tus recetas</p>
            <p className="text-sm italic text-red-500 mt-1">
              Por mantenimiento, las acciones de editar, eliminar y crear están deshabilitadas. Comuníquese con el administrador del sistema.
            </p>
          </div>
          <Button
            disabled
            onClick={() => {
              setEditingReceta(null)
              setIsModalOpen(true)
            }}
            className="bg-orange-600 hover:bg-orange-700 opacity-50 cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Receta
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Recetas ({filteredRecetas.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar recetas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Receta</th>
                    <th className="text-left py-3">Categoría</th>
                    <th className="text-left py-3">Tiempo</th>
                    <th className="text-left py-3">Dificultad</th>
                    <th className="text-right py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecetas.map((receta) => (
                    <tr key={receta.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <Image
                            // Si receta.image_url es vacío o solo espacios, se usa el placeholder
                            src={receta.image_url && receta.image_url.trim() !== "" ? receta.image_url : "/placeholder.svg?height=100&width=100&text=Sin+imagen"}
                            alt={receta.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{receta.name}</p>
                            <p className="text-sm text-gray-500">{receta.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{receta.category}</td>
                      <td className="py-3">{receta.time}</td>
                      <td className="py-3">{receta.difficulty}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setViewRecetaId(`${receta.id}`)
                              setIsModalOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            disabled
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(receta)}
                            className="opacity-50 cursor-not-allowed"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            disabled
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(receta.id)}
                            className="text-red-600 hover:text-red-700 opacity-50 cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <RecetaModal
          isOpen={isModalOpen && viewRecetaId === ""}
          onClose={() => {
            setIsModalOpen(false)
            setEditingReceta(null)
          }}
          onSave={handleSave}
          receta={editingReceta}
        />
        <RecetaViewModal
          isOpen={isModalOpen && Boolean(viewRecetaId)}
          recetaId={Number(viewRecetaId)}
          onClose={() => {
            setIsModalOpen(false)
            setViewRecetaId("")
          }}
        />
      </div>
    </AdminLayout>
  )
}
