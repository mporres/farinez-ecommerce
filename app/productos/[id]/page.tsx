"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"
import { useCart } from "@/contexts/CartContext"

export default function ProductDetailPage() {
	const { id } = useParams() // Extraemos 'id' del hook useParams
	// Eliminamos el JSON estático y creamos estado para el producto
	const [product, setProduct] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const { addItem } = useCart()

	useEffect(() => {
		fetch(`http://localhost:3000/api/productos/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setProduct(data)
				setLoading(false)
			})
			.catch((err) => {
				console.error("Error al cargar producto:", err)
				setLoading(false)
			})
	}, [id])

	if (loading) {
		return (
			<div>
				<Header />
				<CartSidebar />
				<p>Cargando producto...</p>
			</div>
		)
	}

	if (!product) {
		return (
			<div className="min-h-screen">
				<Header />
				<CartSidebar />
				<div className="container mx-auto">
					<p>Producto no encontrado</p>
				</div>
			</div>
		)
	}

	const handleAddToCart = () => {
		addItem({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image_url,
			type: "product",
		})
	}

	return (
		<div className="min-h-screen">
			<Header />
			<CartSidebar />
			<div className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="mb-6">
					<Link href="/productos" className="text-orange-600 hover:underline">
						Productos
					</Link>
					<span className="mx-2">/</span>
					<span>{product.name}</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Imagen del producto */}
					<div>
						<Image
							src={product.image_url || "/placeholder.svg"}
							alt={product.name}
							width={600}
							height={400}
							className="w-full h-auto object-cover"
						/>
					</div>

					{/* Información del producto */}
					<div>
						<h1 className="text-3xl font-bold mb-2">{product.name}</h1>
						<p className="text-gray-600 mb-4">{product.description}</p>
						<p className="text-xl font-semibold mb-4">${product.price}</p>

						<Button
							onClick={handleAddToCart}
							className="bg-orange-600 hover:bg-orange-700"
						>
							Agregar al carrito
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
