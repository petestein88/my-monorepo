import Header from '../components/Header'
import Footer from '../components/Footer'

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-24 flex-grow">
        <div className="container-custom">
          <h1 className="text-5xl md:text-7xl font-light mb-12 text-center">
            About Sacred
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
            <p>
              Sacred was born from a simple observation: our phones have become the last thing we see before sleep and the first thing we reach for when we wake. This intimate relationship with our devices has fundamentally altered how we experience rest, presence, and connection.
            </p>
            
            <h2 className="text-3xl font-light mt-16 mb-6">Our Mission</h2>
            <p>
              We're building tools and community to help people reclaim their attention, their sleep, and their homes. Not through willpower alone, but through practical systems that make the right choice the easy choice.
            </p>
            
            <h2 className="text-3xl font-light mt-16 mb-6">How It Works</h2>
            <p>
              Sacred provides transparency into your smartphone use through physical separation. Our device creates a designated space for phones during important moments—dinnertime, bedtime, focused work—giving you real data about your relationship with technology.
            </p>
            <p>
              When you place your phone in a Sacred station, you're not just charging it. You're making a commitment to be present. To sleep better. To connect deeper. And you can track that commitment over time, alone or with your family and friends.
            </p>
            
            <h2 className="text-3xl font-light mt-16 mb-6">The Community</h2>
            <p>
              You're not alone in this. Thousands of people are rediscovering what matters by stepping away from the digital glow. Share your journey, challenge friends, celebrate streaks, and find inspiration from others walking the same path.
            </p>
            
            <div className="mt-16 p-8 border border-sacred-white/20 rounded-sm text-center">
              <p className="text-2xl font-light mb-4">Ready to begin?</p>
              <a href="/app" className="btn-primary inline-block">
                Create Your Account
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default About
