"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AdminPaquetesPage() {
  const [paquetes, setPaquetes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se quita temporalmente el check de rol
    // if (!isAuthenticated || (isAuthenticated && user?.role !== "operador")) {
    //   router.push("/login")
    // }
  }, [user, router])

  useEffect(() => {
    fetchPaquetes()
  }, [])

  const fetchPaquetes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/paquetes")
      const sorted = response.data.sort(
        (a: any, b: any) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      )
      setPaquetes(sorted)
    } catch (err) {
      console.error(err)
      setError("Error al cargar los paquetes")
    } finally {
      setLoading(false)
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "pendiente"
      case "processing":
        return "en preparación"
      case "shipped":
        return "enviado"
      case "delivered":
        return "recibido"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  // Agregar función para formatear la fecha al formato "YYYY-MM-DD HH:mm:ss"
  const formatDate = (dateInput: string) => {
    const d = new Date(dateInput)
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  const handleStatusChange = async (paqueteId: number, newStatus: string) => {
    const paqueteToUpdate = paquetes.find(p => p.id === paqueteId)
    if (!paqueteToUpdate) {
      alert("Paquete no encontrado")
      return
    }
    // Formatear la fecha adecuadamente
    const formattedFecha = formatDate(paqueteToUpdate.fecha_creacion)
    // Construir el payload usando solo los campos que requiere la API con fecha formateada
    const updatedPayload = {
      numero_orden: paqueteToUpdate.numero_orden,
      usuario_id: paqueteToUpdate.usuario_id,
      total: paqueteToUpdate.total,
      estado: newStatus,
      direccion_envio: paqueteToUpdate.direccion_envio,
      fecha_creacion: formattedFecha,
      items: paqueteToUpdate.items
    }
    try {
      console.log("Actualizando paquete", paqueteId, "con payload:", updatedPayload)
      await axios.put(
        `http://localhost:3000/api/paquetes/${paqueteId}`, 
        updatedPayload,
        { headers: { "Content-Type": "application/json" } }
      )
      fetchPaquetes()
    } catch (error: any) {
      console.error("Error al actualizar estado", error.response?.data || error.message)
      alert("No se pudo actualizar el estado. Verifique los logs en el servidor para más detalles.")
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paquetes.map((paquete) => {
              const estadoTraducido = translateStatus(paquete.estado)
              return (
                <div key={paquete.id} className="border rounded-lg shadow p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Orden #{paquete.numero_orden}</h2>
                    <p className="mb-1"><strong>Total:</strong> ${paquete.total}</p>
                    <p className="mb-1"><strong>Dirección:</strong> {paquete.direccion_envio}</p>
                    <p className="mb-1">
                      <strong>Fecha:</strong> {new Date(paquete.fecha_creacion).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="mb-1">
                      <strong>Estado:</strong>{" "}
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(estadoTraducido)}`}>
                        {estadoTraducido}
                      </span>
                    </p>
                    <select
                      defaultValue={paquete.estado}
                      onChange={(e) => handleStatusChange(paquete.id, e.target.value)}
                      className="w-full border p-2 rounded mt-2"
                    >
                      <option value="pending">pendiente</option>
                      <option value="processing">en preparación</option>
                      <option value="shipped">enviado</option>
                      <option value="delivered">recibido</option>
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
