import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Partners from '@/components/Partners'
import Services from '@/components/Services'
import WhyChoose from '@/components/WhyChoose'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Partners />
      <Services />
      <WhyChoose />
      <CTA />
      <Footer />
    </main>
  )
}
