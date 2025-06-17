"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { AdminLayout } from "@/components/admin/AdminLayout"

export default function AdminPaquetesPage() {
  const [paquetes, setPaquetes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3000/api/paquetes")
      .then((response) => {
        const sorted = response.data.sort(
          (a: any, b: any) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
        )
        setPaquetes(sorted)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Error al cargar los paquetes")
        setLoading(false)
      })
  }, [])

  const translateStatus = (status: string) => {
    switch(status) {
      case "pending":
        return "pendiente"
      case "shipped":
        return "enviado"
      case "delivered":
        return "recibido"
      case "processing":
        return "en preparación"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "en preparación":
        return "bg-purple-100 text-purple-800"
      case "enviado":
        return "bg-blue-100 text-blue-800"
      case "recibido":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Actualiza la definición del menú quitando el item "Pedidos"
  const menuItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Productos", href: "/admin/productos" },
    { name: "Recetas", href: "/admin/recetas" },
    { name: "Usuarios", href: "/admin/usuarios" },
    { name: "Paquetes", href: "/admin/paquetes" },
    // Se eliminó el item "Pedidos"
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Paquetes</h1>
        {loading ? (
          <p>Cargando paquetes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : paquetes.length === 0 ? (
          <p>No se encontraron paquetes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Orden</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Dirección</th>
                  <th className="text-left p-2">Fecha Creación</th>
                </tr>
              </thead>
              <tbody>
                {paquetes.map((paquete) => {
                  const estadoTraducido = translateStatus(paquete.estado)
                  return (
                    <tr key={paquete.id} className="border-b">
                      <td className="p-2">#{paquete.numero_orden}</td>
                      <td className="p-2 font-semibold">${paquete.total}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(estadoTraducido)}`}>
                          {estadoTraducido}
                        </span>
                      </td>
                      <td className="p-2">{paquete.direccion_envio}</td>
                      <td className="p-2">{new Date(paquete.fecha_creacion).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}