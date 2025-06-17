"use client"

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const { itemCount, setIsOpen } = useCart()
  const { user, logout } = useAuth()

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-600">
          FARINEZ
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">
            Inicio
          </Link>
          <Link href="/productos" className="text-gray-700 hover:text-orange-600 transition-colors">
            Productos
          </Link>
          <Link href="/recetas" className="text-gray-700 hover:text-orange-600 transition-colors">
            Recetas
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hola, {user.username}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Salir
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Ingresar
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
