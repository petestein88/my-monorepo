import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Video Background Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video will be added separately - placeholder for now */}
        <div className="absolute inset-0 bg-sacred-black z-0" />
        
        <div className="relative z-10 text-center container-custom">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 tracking-tight">
            reclaim sacred space
          </h1>
          <p className="text-xl md:text-2xl text-sacred-white/80 mb-12 max-w-3xl mx-auto">
            We believe the home is sacred. Real human connection is sacred. Sleep is sacred. You are sacred.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/app" className="btn-primary">
              Get Started
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-sacred-gray">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
            <p>
              Our attention is scattered. Our sleep is broken. Our homes feel less like sanctuaries and more like extensions of the digital world. The tech giants have engineered addiction into your pocket—every scroll, every notification designed to keep you reaching.
            </p>
            <p className="font-medium">
              But something shifts when you step away.
            </p>
            <p>
              We're a community built on transparency and visibility into smartphone use in the home. We shine the light of truth—not to shame you, but to empower you. This isn't about willpower. It's about proximity. When you physically separate from your phone, something profound happens: your mind settles. Your body remembers what real rest feels like. Conversations go deeper. Books hold you longer than scrolls. And you sleep like you remember sleeping.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
            <p>
              You decide when, where, and how you use your phone. You decide to reclaim your evenings. You decide your home is yours again. When you put your phone away at night, you're following through on the promises you make to yourself, your family, and those around you. You're showing respect for what truly matters—mealtimes, sleep, attention, and time itself.
            </p>
            <p>
              Respect yourself enough to prioritize your sleep. Respect your potential. When you step away from the glow, something magical happens: you find yourself again. You find flow. You find presence. You find peace. The mundane becomes meditation. Reading becomes adventure. Boredom births creativity. You feel unbound. You feel free. You feel how you're meant to feel.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-sacred-gray">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8">
            Join the Movement
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto text-sacred-white/80">
            We're building a movement for creatives seeking focus, families seeking presence, sleepers seeking restoration, and anyone brave enough to question the life they're living—and curious enough to discover what lies on the other side.
          </p>
          <p className="text-2xl font-medium mb-12">
            Join thousands reclaiming what matters most. Because when you leave your phone behind, you don't lose connection. You find it.
          </p>
          <p className="text-3xl font-light">
            Together, we are sacred.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing
