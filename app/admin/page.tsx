"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Users, ChefHat, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { AdminLayout } from "@/components/admin/AdminLayout"
import axios from "axios"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!user || user.tipo !== "administrador") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.tipo !== "administrador") {
    return null
  }
  
  // Nuevo estado para productos
  const [productos, setProductos] = useState<any[]>([])
  const [loadingProductos, setLoadingProductos] = useState(true)
  const [errorProductos, setErrorProductos] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3000/api/productos")
      .then((response) => {
        setProductos(response.data)
        setLoadingProductos(false)
      })
      .catch((err) => {
        console.error(err)
        setErrorProductos("Error al cargar los productos")
        setLoadingProductos(false)
      })
  }, [])

  // Agregar estado para recetas y consumir la API
  const [recetas, setRecetas] = useState<any[]>([])
  const [loadingRecetas, setLoadingRecetas] = useState(true)
  const [errorRecetas, setErrorRecetas] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3000/api/recetas")
      .then((response) => {
        setRecetas(response.data)
        setLoadingRecetas(false)
      })
      .catch((err) => {
        console.error(err)
        setErrorRecetas("Error al cargar las recetas")
        setLoadingRecetas(false)
      })
  }, [])

  // Agregar estado para usuarios y consumir la API GET /api/usuarios
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loadingUsuarios, setLoadingUsuarios] = useState(true)
  const [errorUsuarios, setErrorUsuarios] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3000/api/usuarios")
      .then((response) => {
        setUsuarios(response.data)
        setLoadingUsuarios(false)
      })
      .catch((err) => {
        console.error(err)
        setErrorUsuarios("Error al cargar los usuarios")
        setLoadingUsuarios(false)
      })
  }, [])

  // Datos estáticos (no modificados)
  const baseStats = [
    {
      title: "Total Productos",
      value: loadingProductos ? "Cargando..." : errorProductos ? errorProductos : productos.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Recetas",
      value: loadingRecetas ? "Cargando..." : errorRecetas ? errorRecetas : recetas.length.toString(),
      icon: ChefHat,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Usuarios Registrados",
      value: loadingUsuarios ? "Cargando..." : errorUsuarios ? errorUsuarios : usuarios.length.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    // Estos dos se actualizarán dinámicamente
    {
      title: "Pedidos enviados",
      value: "0",
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Ventas del mes",
      value: "$0",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ]
  
  // Estado de paquetes y manejo de la consulta
  const [paquetes, setPaquetes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    axios.get("http://localhost:3000/api/paquetes")
      .then((response) => {
        // Ordenar paquetes de más nuevo a más viejo
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
  
  // Calcular dinámicamente pedidos enviados y ventas totales usando la data de paquetes
  const pedidosEnviados = paquetes.filter(
    (pedido) => pedido.estado === "shipped" || pedido.estado === "delivered"
  ).length
  const ventasTotales = paquetes.reduce(
    (acc, pedido) => acc + parseFloat(pedido.total), 0
  )
  
  // Calcular crecimiento basado en paquetes: porcentaje de pedidos enviados sobre el total de pedidos
  const crecimiento = paquetes.length > 0 ? (((pedidosEnviados) / paquetes.length) * 100).toFixed(2) + "%" : "0%"
  
  // Construir el array de stats actualizando los valores dinámicos
  const stats = [
    ...baseStats.slice(0, 3),
    {
      title: "Pedidos enviados",
      value: loading ? "Cargando..." : pedidosEnviados.toString(),
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Ventas del mes",
      value: loading ? "Cargando..." : `$${ventasTotales.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Crecimiento",
      value: crecimiento,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    ...baseStats.slice(5)
  ]
  
  // Función para traducir y colorear el estado (sin cambios respecto a la sección anterior)
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
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header & Stats Grid */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de administración de Farinez</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
  
        {/* Sección para Paquetes Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Paquetes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Cargando paquetes...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Orden</th>
                      <th className="text-left py-2">Total</th>
                      <th className="text-left py-2">Estado</th>
                      <th className="text-left py-2">Dirección</th>
                      <th className="text-left py-2">Fecha Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paquetes.map((paquete) => {
                      const estadoTraducido = translateStatus(paquete.estado)
                      return (
                        <tr key={paquete.id} className="border-b">
                          <td className="py-2">#{paquete.numero_orden}</td>
                          <td className="py-2 font-semibold">${paquete.total}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(estadoTraducido)}`}>
                              {estadoTraducido}
                            </span>
                          </td>
                          <td className="py-2">{paquete.direccion_envio}</td>
                          <td className="py-2">
                            {new Date(paquete.fecha_creacion).toLocaleString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
