import { Header } from "@/components/Header"
import { CartSidebar } from "@/components/CartSidebar"
import { HeroSection } from "@/components/HeroSection"
import { ProductsSection } from "@/components/ProductsSection"
import { PromotionsSection } from "@/components/PromotionsSection"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { RecetasSection } from "@/components/RecetasSection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main>
        <section
          className="hero h-screen flex items-center justify-center relative"
          style={{
            backgroundImage: "url('/Portada.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10">
            <HeroSection />
          </div>
        </section>
        <ProductsSection />
        <RecetasSection />
        <PromotionsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
