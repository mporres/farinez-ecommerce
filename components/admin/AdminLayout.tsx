"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ChefHat, Users, ShoppingCart, Menu, X, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("¿Seguro que quiere salir?")) {
      logout();
      router.push("/");
    }
  }

  // Filtrar navegación usando user?.tipo en lugar de user?.role
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["administrador"] },
    { name: "Productos", href: "/admin/productos", icon: Package, roles: ["administrador"] },
    { name: "Recetas", href: "/admin/recetas", icon: ChefHat, roles: ["administrador"] },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users, roles: ["administrador"] },
    { name: "Paquetes", href: "/admin/paquetes", icon: Package, roles: ["administrador", "operador"] },
  ]
  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.tipo || "customer"))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              {/* Actualizar título usando user?.tipo */}
              <h2 className="text-lg font-semibold text-orange-600">
                {user?.tipo === "operador" ? "FARINEZ OPERADOR" : "FARINEZ ADMIN"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {filteredNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center px-4 py-6 border-b">
            <h2 className="text-lg font-semibold text-orange-600">
              {user?.tipo === "operador" ? "FARINEZ OPERADOR" : "FARINEZ ADMIN"}
            </h2>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-gray-500">
                  {user?.tipo === "administrador" ? "Administrador" : user?.tipo === "operador" ? "Operador" : "Usuario"}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <Home className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-orange-600">
              {user?.tipo === "operador" ? "FARINEZ OPERADOR" : "FARINEZ ADMIN"}
            </h1>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
