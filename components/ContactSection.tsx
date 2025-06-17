import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ContactSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Dirección</h3>
              <p className="text-gray-600">
                Av. Principal 123
                <br />
                Ciudad, País
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">+54 11 1234-5678</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@farinez.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Horarios</h3>
              <p className="text-gray-600">
                Lun-Vie: 9-18hs
                <br />
                Sáb: 9-13hs
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
