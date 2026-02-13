import { useNavigate } from 'react-router-dom'
import { utils } from '../utils'

const Landing = () => {
    const navigate = useNavigate()

    const handleOpenApp = () => {
        navigate(utils.helpers.getRoute('/auth/signin'))
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-2xl font-light tracking-wider">sacred</div>
                    <button
                        onClick={handleOpenApp}
                        className="px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
                    >
                        Open App
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-5xl md:text-7xl font-light leading-tight tracking-tight">
                        We believe the home is sacred.
                        <br />
                        Real human connection is sacred.
                        <br />
                        Sleep is sacred.
                        <br />
                        <span className="text-gray-400">You are sacred.</span>
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto space-y-12 text-lg leading-relaxed text-gray-300">
                    <p>
                        Our attention is scattered. Our sleep is broken. Our homes feel less like sanctuaries and more like extensions of the digital world. The tech giants have engineered addiction into your pocket—every scroll, every notification designed to keep you reaching.
                    </p>

                    <p className="text-2xl text-white font-light">
                        But something shifts when you step away.
                    </p>

                    <p>
                        We're a community built on transparency and visibility into smartphone use in the home. We shine the light of truth—not to shame you, but to empower you. This isn't about willpower. It's about proximity. When you physically separate from your phone, something profound happens: your mind settles. Your body remembers what real rest feels like. Conversations go deeper. Books hold you longer than scrolls. And you sleep like you remember sleeping.
                    </p>

                    <p>
                        You decide when, where, and how you use your phone. You decide to reclaim your evenings. You decide your home is yours again. When you put your phone away at night, you're following through on the promises you make to yourself, your family, and those around you. You're showing respect for what truly matters—mealtimes, sleep, attention, and time itself.
                    </p>

                    <p>
                        Respect yourself enough to prioritize your sleep. Respect your potential. When you step away from the glow, something magical happens: you find yourself again. You find flow. You find presence. You find peace. The mundane becomes meditation. Reading becomes adventure. Boredom births creativity. You feel unbound. You feel free. You feel how you're meant to feel.
                    </p>

                    <p>
                        We're building a movement for creatives seeking focus, families seeking presence, sleepers seeking restoration, and anyone brave enough to question the life they're living—and curious enough to discover what lies on the other side.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-light">
                        Join thousands reclaiming what matters most.
                    </h2>
                    <p className="text-xl text-gray-400">
                        Because when you leave your phone behind, you don't lose connection. You find it.
                    </p>
                    <button
                        onClick={handleOpenApp}
                        className="px-12 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                        Get Started
                    </button>
                    <p className="text-2xl font-light text-white pt-8">
                        Together, we are sacred.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                    <p>© 2026 Sacred. Reclaim sacred space.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing
