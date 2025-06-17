"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"
import axios from "axios"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const { login, user } = useAuth()

  // Si hay sesión activa, redirige según el tipo de usuario.
  useEffect(() => {
    if (user) {
      if (user.tipo === "administrador") {
        router.push("/admin")
      } else if (user.tipo === "operador") {
        router.push("/admin/paquetes")
      } else {
        router.push("/")
      }
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/validate", {
        nombre_usuario: username,
        password: password,
      })
      console.log("Respuesta de validación:", data)

      if (data.valid) {
        // Crea la sesión mediante AuthContext
        login(username, data.tipo)
        setSuccessMessage("Inicio de sesión correcto. ¡Todo está OK!")
      } else {
        setError("Credenciales incorrectas")
      }
    } catch (err) {
      setError("Error en el inicio de sesión")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CartSidebar />
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                Ingresar
              </Button>
            </form>
            {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
            
            <p className="mt-4 text-sm text-gray-500">
              ¿Olvidaste tu contraseña? Contacta a{" "}
              <a href="mailto:admin@farinez.com" className="underline">
                admin@farinez.com
              </a>
              .
            </p>

            <div className="mt-4 text-sm text-gray-600">
              <p>Usuarios de prueba:</p>
              <p>• admin:admin (Administrador)</p>
              <p>• operador:operador (Operador)</p>
              <p>• compra:compra (Cliente)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
