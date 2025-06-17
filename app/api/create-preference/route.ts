import { type NextRequest, NextResponse } from "next/server"

const MERCADOPAGO_ACCESS_TOKEN = "TEST-7590277369621914-052921-f81d19a6f60b2cbe21aba8b14cbb58bd-474770107"
const BASE_URL = "http://localhost:3000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shipping_cost, total } = body

    // Crear los items para MercadoPago
    const mpItems = items.map((item: any) => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: "ARS",
    }))

    // Agregar el costo de envío como un item adicional
    mpItems.push({
      title: "Envío",
      quantity: 1,
      unit_price: shipping_cost,
      currency_id: "ARS",
    })

    const preference = {
      items: mpItems,
      back_urls: {
        success: `${BASE_URL}/pago/success`,
        failure: `${BASE_URL}/pago/failure`,
        pending: `${BASE_URL}/pago/pending`,
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      shipments: {
        cost: shipping_cost,
        mode: "not_specified",
      },
      notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({
        id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point,
      })
    } else {
      console.error("Error de MercadoPago:", data)
      return NextResponse.json({ error: "Error al crear la preferencia de pago" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
