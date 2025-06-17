import { Card, CardContent } from "@/components/ui/card"

const promotions = [
  {
    id: "1",
    title: "10% OFF",
    description: "Promo 1",
    color: "bg-red-500",
  },
  {
    id: "2",
    title: "2x1",
    description: "Promo 2",
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "-30%",
    description: "Promo 3",
    color: "bg-blue-500",
  },
]

export function PromotionsSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Promociones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Card key={promo.id} className={`${promo.color} text-white overflow-hidden`}>
              <CardContent className="p-8 text-center">
                <h3 className="text-4xl font-bold mb-2">{promo.title}</h3>
                <p className="text-lg">{promo.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
