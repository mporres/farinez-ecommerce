"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function RecetasSection() {
	const [recetas, setRecetas] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch("http://localhost:3000/api/recetas")
			.then((res) => res.json())
			.then((data) => {
				const mapped = data.map((r: any) => ({
					id: r.id,
					name: r.name,
					description: r.description,
					difficulty: r.difficulty,
					time: r.time,
					servings: r.servings,
					category: r.category,
					price: r.price,
					image: r.image_url && r.image_url.trim() !== ""
						? r.image_url
						: "/placeholder.svg?height=100&width=100&text=Sin+imagen"
				}))
				setRecetas(mapped)
				setLoading(false)
			})
			.catch((err) => {
				console.error("Error al cargar recetas:", err)
				setLoading(false)
			})
	}, [])

	return (
		<section className="py-16 px-4">
			<div className="container mx-auto">
				<h2 className="text-3xl font-bold mb-8">Nuestras Recetas</h2>
				{loading ? (
					<p>Cargando recetas...</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{recetas.slice(0, 3).map((receta) => (
							<Card key={receta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
								<CardContent className="p-0">
									<Link href={`/recetas/${receta.id}`}>
										<Image
											src={receta.image}
											alt={receta.name}
											width={300}
											height={200}
											className="w-full h-48 object-cover cursor-pointer"
										/>
									</Link>
									<div className="p-4">
										<h3 className="font-semibold text-lg mb-1">{receta.name}</h3>
										<p className="text-gray-600 text-sm mb-2">{receta.description}</p>
										<div className="flex items-center justify-between">
											<span className="text-blue-600 font-bold text-lg">{receta.difficulty}</span>
											<Link href={`/recetas/${receta.id}`}>
												<Button size="sm" variant="outline">
													Ver
												</Button>
											</Link>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
				<div className="text-center">
					<Link href="/recetas">
						<Button className="bg-black text-white hover:bg-gray-800">Ver todas las recetas</Button>
					</Link>
				</div>
			</div>
		</section>
	)
}
