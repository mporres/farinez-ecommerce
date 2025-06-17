"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import axios from "axios"

interface Usuario {
  id: number
  nombre: string
  email: string
  tipo: string
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  // Agregar nuevos estados para búsqueda y filtrado
  const [filterName, setFilterName] = useState("")
  const [filterRole, setFilterRole] = useState("")

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios")
      setUsuarios(response.data)
    } catch (error) {
      console.error("Error al cargar usuarios", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "administrador":
        return "bg-red-100 text-red-800"
      case "operador":
        return "bg-blue-100 text-blue-800"
      case "cliente":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchName = usuario.nombre.toLowerCase().includes(filterName.toLowerCase())
    const matchRole = filterRole === "" || usuario.tipo.toLowerCase() === filterRole.toLowerCase()
    return matchName && matchRole
  })

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Cargando...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Usuarios</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="">Todos los roles</option>
            <option value="administrador">Administrador</option>
            <option value="operador">Operador</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>
        {filteredUsuarios.length === 0 ? (
          <p>No se encontraron usuarios.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {/* Columna de ID oculta */}
                  <th className="hidden">ID</th>
                  <th className="text-left p-2">Nombre</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Rol</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b">
                    <td className="hidden p-2">{usuario.id}</td>
                    <td className="p-2">{usuario.nombre}</td>
                    <td className="p-2">{usuario.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(usuario.tipo)}`}>
                        {usuario.tipo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
