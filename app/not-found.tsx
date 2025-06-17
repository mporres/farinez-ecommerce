import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">Lo sentimos, la página que estás buscando no existe o ha sido eliminada.</p>
        <Link href="/">
          <Button className="bg-orange-600 hover:bg-orange-700">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
