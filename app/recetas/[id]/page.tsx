"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"
import { useCart } from "@/contexts/CartContext"
import { useParams } from "next/navigation"

export default function RecetaDetailPage() {
	const { id } = useParams()
	const [receta, setReceta] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const { addItem } = useCart()

	// Estado para detalles de ingredientes y los seleccionados
	const [ingredientsDetails, setIngredientsDetails] = useState<any[]>([])
	const [selectedIngredients, setSelectedIngredients] = useState<any[]>([])

	useEffect(() => {
		fetch(`http://localhost:3000/api/recetas/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setReceta(data)
				setLoading(false)
			})
			.catch((err) => {
				console.error("Error al cargar receta:", err)
				setLoading(false)
			})
	}, [id])

	// Una vez cargada la receta, obtener detalles de cada ingrediente
	useEffect(() => {
		if (receta && receta.ingredientes && receta.ingredientes.length > 0) {
			Promise.all(
				receta.ingredientes.map((ing: any) =>
					fetch(`http://localhost:3000/api/productos/${ing.producto_id}`)
						.then((res) => res.json())
						.then((product) => ({
							...product,
							cantidad: ing.cantidad_en_receta,
							conversion: ing.conversion_note,
						}))
				)
			)
				.then((products) => setIngredientsDetails(products))
				.catch((err) => console.error("Error al cargar ingredientes:", err))
		}
	}, [receta])

	const toggleSelect = (prod: any) => {
		setSelectedIngredients((prev) =>
			prev.some((item) => item.id === prod.id)
				? prev.filter((item) => item.id !== prod.id)
				: [...prev, prod]
		)
	}

	const handleAddIngredientsToCart = () => {
		selectedIngredients.forEach((prod) => {
			addItem({
				id: prod.id,
				name: prod.name,
				price: prod.price,
				image: prod.image_url,
				type: "product",
			})
		})
	}

	if (loading) {
		return (
			<div>
				<Header />
				<CartSidebar />
				<p>Cargando receta...</p>
			</div>
		)
	}

	if (!receta) {
		return (
			<div className="min-h-screen">
				<Header />
				<CartSidebar />
				<div className="container mx-auto">
					<p>Receta no encontrada</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<Header />
			<CartSidebar />
			<div className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="mb-6">
					<Link href="/recetas" className="text-orange-600 hover:underline">
						Recetas
					</Link>
					<span className="mx-2">/</span>
					<span>{receta.name}</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Imagen de la receta */}
					<div>
						<Image
							src={receta.image_url || "/placeholder.svg?height=100&width=100&text=Sin+imagen"}
							alt={receta.name}
							width={600}
							height={400}
							className="w-full h-auto object-cover"
						/>
					</div>

					{/* Información de la receta */}
					<div>
						<h1 className="text-3xl font-bold mb-2">{receta.name}</h1>
						<p className="text-gray-600 mb-4">{receta.description}</p>
						<p className="text-lg mb-2">
							<span className="font-semibold">Dificultad:</span> {receta.difficulty}
						</p>
						<p className="text-lg mb-2">
							<span className="font-semibold">Tiempo:</span> {receta.time}
						</p>
						<p className="text-lg mb-2">
							<span className="font-semibold">Porciones:</span> {receta.servings}
						</p>
					</div>
				</div>

				{/* Sección de ingredientes como grilla */}
				{ingredientsDetails.length > 0 && (
					<div className="mt-8">
						<h3 className="text-2xl font-semibold mb-4">Ingredientes</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{ingredientsDetails.map((prod) => (
								<div
									key={prod.id}
									className={`border p-4 rounded cursor-pointer ${
										selectedIngredients.some((item) => item.id === prod.id)
											? "bg-orange-100 border-orange-600"
											: "hover:bg-gray-100"
									}`}
									onClick={() => toggleSelect(prod)}
								>
									<Image
										src={prod.image_url || "/placeholder.svg"}
										alt={prod.name}
										width={100}
										height={100}
										className="w-full h-auto object-cover mb-2"
									/>
									<p className="font-medium text-center">{prod.name}</p>
									<p className="text-sm text-center">
										{prod.cantidad}
										{prod.conversion && prod.conversion.trim() !== "" && ` (${prod.conversion})`}
									</p>
								</div>
							))}
						</div>
						<div className="mt-4">
							<Button
								onClick={handleAddIngredientsToCart}
								className="bg-orange-600 hover:bg-orange-700"
								disabled={selectedIngredients.length === 0}
							>
								Agregar ingredientes al carrito
							</Button>
						</div>
					</div>
				)}

				{/* Sección de instrucciones */}
				{receta.instrucciones && receta.instrucciones.length > 0 && (
					<div className="mt-8">
						<h3 className="text-2xl font-semibold mb-4">Instrucciones</h3>
						<ol className="list-decimal pl-5">
							{receta.instrucciones.map((step: any) => (
								<li key={step.id} className="mb-2">
									<span className="font-medium">Paso {step.paso_numero}:</span> {step.descripcion}
								</li>
							))}
						</ol>
					</div>
				)}
			</div>
		</div>
	)
}
