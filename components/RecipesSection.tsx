import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const featuredRecipes = [
  {
    id: "1",
    name: "Waffles",
    image: "/placeholder.svg?height=200&width=200&text=Waffles",
    difficulty: "Fácil",
  },
  {
    id: "2",
    name: "Pizza",
    image: "/placeholder.svg?height=200&width=200&text=Pizza",
    difficulty: "Medio",
  },
  {
    id: "3",
    name: "Galletas",
    image: "/placeholder.svg?height=200&width=200&text=Galletas",
    difficulty: "Fácil",
  },
]

export function RecipesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Recetas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Link href={`/recetas/${recipe.id}`}>
                  <Image
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover cursor-pointer"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{recipe.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">Dificultad: {recipe.difficulty}</p>
                  <Link href={`/recetas/${recipe.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Link href="/recetas">
            <Button className="bg-black text-white hover:bg-gray-800">Ver todas las recetas</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
