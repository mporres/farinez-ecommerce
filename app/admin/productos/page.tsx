"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { ProductModal } from "@/components/admin/ProductModal"
import { ProductViewModal } from "@/components/admin/ProductViewModal"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
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

export default function AdminProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewProductId, setViewProductId] = useState<string>("")
  const submittedRef = useRef(false);

  useEffect(() => {
    if (user && user.tipo !== "administrador") {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/productos")
      setProducts(response.data)
    } catch (error) {
      console.error("Error al cargar productos", error)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:3000/api/productos/${id}`);
        await loadProducts();
      } catch (error: any) {
        const errMsg = error.response?.data?.error || error.message;
        console.error("Error al eliminar el producto", errMsg);
        alert(`Error al eliminar el producto: ${errMsg}`);
      }
    }
  }

  // Agregar funciones separadas para actualizar y crear:
  const updateProduct = async (data: Omit<Product, "id">) => {
    const payload = {
      name: data.name,
      price: parseFloat(String(data.price)).toFixed(2), // price como string
      category: data.category,
      stock: Number(data.stock),
      description: data.description,
      image_url: data.image || "/placeholder.svg?height=100&width=100&text=Sin+imagen"
    }
    console.log("Payload para PUT:", payload) // Debug
    await axios.put(
      `http://localhost:3000/api/productos/${editingProduct!.id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    )
    await loadProducts()
  }

  const createProduct = async (data: Omit<Product, "id">) => {
    const payload = {
      name: data.name,
      price: parseFloat(String(data.price)).toFixed(2), // price como string
      category: data.category,
      stock: Number(data.stock),
      description: data.description,
      // Usa el mismo placeholder que en updateProduct:
      image_url: data.image || "/placeholder.svg?height=100&width=100&text=Sin+imagen"
    }
    console.log("Payload para POST:", payload) // Debug
    await axios.post("http://localhost:3000/api/productos", payload, {
      headers: { "Content-Type": "application/json" },
    })
    await loadProducts()
  }

  const handleSave = async (productData: Omit<Product, "id">) => {
    if (submittedRef.current) return; // Evita ejecución duplicada
    submittedRef.current = true;
    
    if (editingProduct !== null) {
      try {
        await updateProduct(productData);
      } catch (error: any) {
        const errMsg = error.response?.data?.error || error.message;
        console.error("Error al actualizar el producto", errMsg);
        alert(`Error al actualizar el producto: ${errMsg}`);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      submittedRef.current = false;
      return;  // Evita que se ejecute el bloque POST
    } else {
      // Verificar duplicado: Compara nombre, precio, categoría, stock, descripción y image_url.
      const duplicate = products.find(p => 
        p.name === productData.name &&
        parseFloat(String(p.price)).toFixed(2) === parseFloat(String(productData.price)).toFixed(2) &&
        p.category === productData.category &&
        p.stock === Number(productData.stock) &&
        p.description === productData.description &&
        (p.image || "") === (productData.image || "")
      );
      if (duplicate) {
        alert("El producto ya existe, no se creará de nuevo");
        setIsModalOpen(false);
        setEditingProduct(null);
        submittedRef.current = false;
        return;
      }
      
      try {
        await createProduct(productData);
      } catch (error: any) {
        const errMsg = error.response?.data?.error || error.message;
        console.error("Error al crear producto", errMsg);
        alert(`Error al crear producto: ${errMsg}`);
      }
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    submittedRef.current = false;
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Dulces: "bg-pink-100 text-pink-800",
      Harinas: "bg-yellow-100 text-yellow-800",
      Panadería: "bg-orange-100 text-orange-800",
      Pastas: "bg-green-100 text-green-800",
      Snacks: "bg-purple-100 text-purple-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <AdminLayout>
      {!user ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <p className="text-2xl font-semibold text-gray-600">Cargando...</p>
        </div>
      ) : user.tipo !== "administrador" ? (
        <div>No autorizado</div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Productos</h1>
              <p className="text-gray-600">Gestiona el catálogo de productos</p>
            </div>
            <Button
              onClick={() => {
                setEditingProduct(null)
                setIsModalOpen(true)
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Lista de Productos ({products.filter(
                    (product) =>
                      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (product.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (product.brand || "").toLowerCase().includes(searchTerm.toLowerCase())
                  ).length})
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar productos..."
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
                      <th className="text-left py-3">Producto</th>
                      <th className="text-left py-3">Categoría</th>
                      <th className="text-left py-3">Precio</th>
                      <th className="text-left py-3">Stock</th>
                      <th className="text-right py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(
                      (product) =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (product.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (product.brand || "").toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <Image
                              // Asegura que si product.image es "" se use el placeholder
                              src={product.image && product.image.trim() !== "" ? product.image : "/placeholder.svg"}
                              alt={product.name}
                              width={40}
                              height={40}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg?height=100&width=100&text=Sin+imagen"
                              }}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className={getCategoryColor(product.category)}>{product.category}</Badge>
                        </td>
                        <td className="py-3 font-semibold">${product.price}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} unidades
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setViewProductId(product.id)
                                setIsModalOpen(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
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
          {/* Siempre renderamos ambos modales */}
          <ProductModal
            isOpen={isModalOpen && !viewProductId}
            onClose={() => {
              setIsModalOpen(false)
              setEditingProduct(null)
            }}
            onSave={handleSave}
            product={editingProduct}
          />
          <ProductViewModal
            isOpen={isModalOpen && Boolean(viewProductId)}
            productId={viewProductId}
            onClose={() => {
              setIsModalOpen(false)
              setViewProductId("")
            }}
          />
        </div>
      )}
    </AdminLayout>
  )
}
