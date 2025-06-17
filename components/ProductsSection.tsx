"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"

export function ProductsSection() {
	const [products, setProducts] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const { addItem } = useCart()

	useEffect(() => {
		fetch("http://localhost:3000/api/productos")
			.then((res) => res.json())
			.then((data) => {
				const mapped = data.map((p: any) => ({
					id: p.id,
					name: p.name,
					description: p.description,
					price: Number(p.price),
					image: p.image_url || "/placeholder.svg"
				}))
				setProducts(mapped)
				setLoading(false)
			})
			.catch((err) => {
				console.error("Error al cargar productos:", err)
				setLoading(false)
			})
	}, [])

	const handleAddToCart = (product: typeof products[0]) => {
		addItem({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			type: "product",
		})
	}

	return (
		<section className="py-16 px-4">
			<div className="container mx-auto">
				<h2 className="text-3xl font-bold mb-8">Nuestros Productos</h2>
				{loading ? (
					<p>Cargando productos...</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{products.slice(0, 3).map((product) => (
							<Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
								<CardContent className="p-0">
									<Link href={`/productos/${product.id}`}>
										<Image
											src={product.image}
											alt={product.name}
											width={300}
											height={200}
											className="w-full h-48 object-cover cursor-pointer"
										/>
									</Link>
									<div className="p-4">
										<h3 className="font-semibold text-lg mb-1">{product.name}</h3>
										<p className="text-gray-600 text-sm mb-2">{product.description}</p>
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
						))}
					</div>
				)}
				<div className="text-center">
					<Link href="/productos">
						<Button className="bg-black text-white hover:bg-gray-800">Ver todos los productos</Button>
					</Link>
				</div>
			</div>
		</section>
	)
}
