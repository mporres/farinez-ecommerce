"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Shield, User, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AppUser {
  id: string
  username: string
  email: string
  role: "admin" | "operator" | "customer"
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
}

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: Omit<AppUser, "id" | "createdAt">) => void
  user?: AppUser | null
}

export function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "customer" as "admin" | "operator" | "customer",
    status: "active" as "active" | "inactive",
    lastLogin: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin || "",
      })
    } else {
      setFormData({
        username: "",
        email: "",
        role: "customer",
        status: "active",
        lastLogin: "",
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const roleOptions = [
    {
      value: "admin",
      label: "Administrador",
      description: "Acceso completo al sistema",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      value: "operator",
      label: "Operador",
      description: "Gestión de paquetes y despachos",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      value: "customer",
      label: "Cliente",
      description: "Compras y consultas",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{user ? "Editar Usuario" : "Nuevo Usuario"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Permisos y Rol */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Permisos y Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-base font-medium">Seleccionar rol del usuario</Label>
              <RadioGroup value={formData.role} onValueChange={(value) => handleChange("role", value)} className="mt-3">
                <div className="space-y-3">
                  {roleOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div className={`p-4 rounded-lg border-2 transition-colors ${option.bgColor}`}>
                          <div className="flex items-center space-x-3">
                            <option.icon className={`w-6 h-6 ${option.color}`} />
                            <div>
                              <p className="font-semibold">{option.label}</p>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* Descripción de permisos */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Permisos del rol seleccionado:</h4>
                {formData.role === "admin" && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Gestión completa de productos y recetas</li>
                    <li>• Administración de usuarios y permisos</li>
                    <li>• Visualización de reportes y estadísticas</li>
                    <li>• Gestión de pedidos y paquetes</li>
                  </ul>
                )}
                {formData.role === "operator" && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visualización y gestión de paquetes</li>
                    <li>• Cambio de estados de pedidos</li>
                    <li>• Preparación y despacho de envíos</li>
                    <li>• Sin acceso a configuración del sistema</li>
                  </ul>
                )}
                {formData.role === "customer" && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Navegación y compra de productos</li>
                    <li>• Visualización de recetas</li>
                    <li>• Gestión de carrito y pedidos propios</li>
                    <li>• Sin acceso administrativo</li>
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {user ? "Actualizar" : "Crear"} Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
