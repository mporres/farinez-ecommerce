"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = { username: string; tipo: string } | null

type AuthContextType = {
  user: User
  login: (username: string, tipo: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)

  // Cargar la sesión persistida al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("session")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username: string, tipo: string) => {
    const newUser = { username, tipo }
    setUser(newUser)
    localStorage.setItem("session", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("session")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
