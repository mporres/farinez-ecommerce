import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">FARINEZ</h3>
            <p className="text-gray-300">Tu tienda especializada en productos y recetas sin gluten.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-white">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/recetas" className="text-gray-300 hover:text-white">
                  Recetas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
              <Twitter className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">© 2024 Farinez. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
