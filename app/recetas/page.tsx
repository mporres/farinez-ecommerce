"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Clock, Users, ChefHat, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"

const allRecipes = [
  {
    id: "1",
    name: "Waffles Sin Gluten",
    difficulty: "Fácil",
    time: "30 min",
    servings: 4,
    category: "Desayuno",
    price: 450,
    image: "/placeholder.svg?height=300&width=400&text=Waffles+Sin+Gluten",
    description: "Deliciosos waffles esponjosos sin gluten, perfectos para el desayuno.",
  },
  {
    id: "2",
    name: "Pizza Sin Gluten",
    difficulty: "Medio",
    time: "45 min",
    servings: 6,
    category: "Almuerzo",
    price: 680,
    image: "/placeholder.svg?height=300&width=400&text=Pizza+Sin+Gluten",
    description: "Pizza casera con masa sin gluten y ingredientes frescos.",
  },
  {
    id: "3",
    name: "Galletas de Chocolate",
    difficulty: "Fácil",
    time: "25 min",
    servings: 12,
    category: "Postre",
    price: 320,
    image: "/placeholder.svg?height=300&width=400&text=Galletas+Chocolate",
    description: "Galletas crujientes de chocolate sin gluten.",
  },
  {
    id: "4",
    name: "Pan Casero",
    difficulty: "Difícil",
    time: "2 horas",
    servings: 8,
    category: "Panadería",
    price: 520,
    image: "/placeholder.svg?height=300&width=400&text=Pan+Casero",
    description: "Pan casero esponjoso y sabroso sin gluten.",
  },
  {
    id: "5",
    name: "Muffins de Arándanos",
    difficulty: "Fácil",
    time: "35 min",
    servings: 6,
    category: "Desayuno",
    price: 380,
    image: "/placeholder.svg?height=300&width=400&text=Muffins+Arandanos",
    description: "Muffins tiernos con arándanos frescos.",
  },
  {
    id: "6",
    name: "Pasta con Salsa",
    difficulty: "Medio",
    time: "40 min",
    servings: 4,
    category: "Almuerzo",
    price: 590,
    image: "/placeholder.svg?height=300&width=400&text=Pasta+Salsa",
    description: "Pasta sin gluten con salsa casera de tomate.",
  },
  {
    id: "7",
    name: "Brownies Fudge",
    difficulty: "Medio",
    time: "50 min",
    servings: 9,
    category: "Postre",
    price: 420,
    image: "/placeholder.svg?height=300&width=400&text=Brownies+Fudge",
    description: "Brownies súper chocolatosos y húmedos sin gluten.",
  },
  {
    id: "8",
    name: "Empanadas Criollas",
    difficulty: "Difícil",
    time: "90 min",
    servings: 12,
    category: "Almuerzo",
    price: 750,
    image: "/placeholder.svg?height=300&width=400&text=Empanadas+Criollas",
    description: "Empanadas tradicionales con masa sin gluten.",
  },
  {
    id: "9",
    name: "Pancakes Americanos",
    difficulty: "Fácil",
    time: "20 min",
    servings: 4,
    category: "Desayuno",
    price: 350,
    image: "/placeholder.svg?height=300&width=400&text=Pancakes+Americanos",
    description: "Pancakes esponjosos estilo americano sin gluten.",
  },
  {
    id: "10",
    name: "Lasagna de Verduras",
    difficulty: "Medio",
    time: "60 min",
    servings: 8,
    category: "Almuerzo",
    price: 650,
    image: "/placeholder.svg?height=300&width=400&text=Lasagna+Verduras",
    description: "Lasagna vegetariana con pasta sin gluten.",
  },
  {
    id: "11",
    name: "Cheesecake de Frutilla",
    difficulty: "Medio",
    time: "4 horas",
    servings: 10,
    category: "Postre",
    price: 580,
    image: "/placeholder.svg?height=300&width=400&text=Cheesecake+Frutilla",
    description: "Cheesecake cremoso con base sin gluten y frutillas.",
  },
  {
    id: "12",
    name: "Medialunas de Manteca",
    difficulty: "Difícil",
    time: "3 horas",
    servings: 8,
    category: "Panadería",
    price: 480,
    image: "/placeholder.svg?height=300&width=400&text=Medialunas+Manteca",
    description: "Medialunas hojaldradas sin gluten, perfectas para el desayuno.",
  },
  {
    id: "13",
    name: "Risotto de Hongos",
    difficulty: "Medio",
    time: "45 min",
    servings: 4,
    category: "Almuerzo",
    price: 620,
    image: "/placeholder.svg?height=300&width=400&text=Risotto+Hongos",
    description: "Risotto cremoso con hongos variados, naturalmente sin gluten.",
  },
  {
    id: "14",
    name: "Torta de Limón",
    difficulty: "Medio",
    time: "55 min",
    servings: 8,
    category: "Postre",
    price: 450,
    image: "/placeholder.svg?height=300&width=400&text=Torta+Limon",
    description: "Torta húmeda de limón con glaseado sin gluten.",
  },
  {
    id: "15",
    name: "Gnocchi de Papa",
    difficulty: "Difícil",
    time: "75 min",
    servings: 6,
    category: "Almuerzo",
    price: 580,
    image: "/placeholder.svg?height=300&width=400&text=Gnocchi+Papa",
    description: "Ñoquis caseros de papa sin gluten con salsa a elección.",
  },
]

const RECIPES_PER_PAGE = 8

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRecipes = allRecipes
    .filter((recipe) => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || recipe.category === categoryFilter
      const matchesDifficulty = difficultyFilter === "all" || recipe.difficulty === difficultyFilter
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && recipe.price < 400) ||
        (priceRange === "medium" && recipe.price >= 400 && recipe.price < 600) ||
        (priceRange === "high" && recipe.price >= 600)

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice
    })
    .sort((a, b) => {
      if (sortBy === "difficulty") {
        const difficultyOrder = { Fácil: 1, Medio: 2, Difícil: 3 }
        return (
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        )
      }
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "time") return Number.parseInt(a.time) - Number.parseInt(b.time)
      return a.name.localeCompare(b.name)
    })

  // Paginación
  const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE
  const endIndex = startIndex + RECIPES_PER_PAGE
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex)

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
      case "difficulty":
        setDifficultyFilter(value)
        break
      case "price":
        setPriceRange(value)
        break
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Medio":
        return "bg-yellow-100 text-yellow-800"
      case "Difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        <h1 className="text-3xl font-bold mb-8">Recetas Sin Gluten</h1>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar recetas..."
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
                <SelectItem value="difficulty">Dificultad</SelectItem>
                <SelectItem value="time">Tiempo</SelectItem>
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
                <SelectItem value="Desayuno">Desayuno</SelectItem>
                <SelectItem value="Almuerzo">Almuerzo</SelectItem>
                <SelectItem value="Postre">Postre</SelectItem>
                <SelectItem value="Panadería">Panadería</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={(value) => handleFilterChange("difficulty", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las dificultades</SelectItem>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Medio">Medio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={(value) => handleFilterChange("price", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los precios</SelectItem>
                <SelectItem value="low">Menos de $400</SelectItem>
                <SelectItem value="medium">$400 - $600</SelectItem>
                <SelectItem value="high">Más de $600</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredRecipes.length)} de {filteredRecipes.length} recetas
          </p>
          <p className="text-gray-600">
            Página {currentPage} de {totalPages}
          </p>
        </div>

        {/* Grid de recetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {recipe.servings}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <ChefHat className="w-4 h-4 mr-1" />
                      {recipe.category}
                    </div>
                    <span className="text-orange-600 font-bold">${recipe.price}</span>
                  </div>

                  <Link href={`/recetas/${recipe.id}`}>
                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron recetas que coincidan con los filtros.</p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={currentPage === page ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
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
