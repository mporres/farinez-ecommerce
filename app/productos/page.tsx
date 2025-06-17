"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"
import { useCart } from "@/contexts/CartContext"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { addItem } = useCart()

  // Estado para productos y paginación
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 6

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:3000/api/productos`)
      .then((res) => res.json())
      .then((data) => {
        const productsArray = Array.isArray(data) ? data : data.products
        setProducts(productsArray)
        setTotalPages(Math.ceil(productsArray.length / limit))
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setLoading(false)
      })
  }, [])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && product.price < 200) ||
        (priceRange === "medium" && product.price >= 200 && product.price < 300) ||
        (priceRange === "high" && product.price >= 300)

      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      return a.name.localeCompare(b.name)
    })

  // Paginación
  const totalFilteredPages = Math.ceil(filteredProducts.length / limit)
  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset página cuando cambian los filtros
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1)
    switch (filterType) {
      case "search":
        setSearchTerm(value)
        break
      case "sort":
        setSortBy(value)
        break
      case "category":
        setCategoryFilter(value)
        break
      case "price":
        setPriceRange(value)
        break
    }
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
    })
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Productos</h1>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Dulces">Dulces</SelectItem>
                <SelectItem value="Harinas">Harinas</SelectItem>
                <SelectItem value="Panadería">Panadería</SelectItem>
                <SelectItem value="Pastas">Pastas</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={(value) => handleFilterChange("price", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los precios</SelectItem>
                <SelectItem value="low">Menos de $200</SelectItem>
                <SelectItem value="medium">$200 - $300</SelectItem>
                <SelectItem value="high">Más de $300</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length}{" "}
            productos
          </p>
          <p className="text-gray-600">
            Página {currentPage} de {totalFilteredPages}
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <p>Cargando productos...</p>
          ) : currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Link href={`/productos/${product.id}`}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="object-cover cursor-pointer"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-bold text-lg">${product.price}</span>
                      <div className="flex space-x-2">
                        <Link href={`/productos/${product.id}`}>
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos que coincidan con los filtros.</p>
            </div>
          )}
        </div>

        {/* Controles de paginación */}
        {totalFilteredPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <span>
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
