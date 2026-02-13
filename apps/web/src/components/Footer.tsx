import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-sacred-white/10 py-12 bg-sacred-black">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-light tracking-wide block mb-4">
              sacred
            </Link>
            <p className="text-sacred-white/60 text-sm">
              Reclaim what matters. One phone-free moment at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium mb-4">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-sacred-white/60 hover:text-sacred-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sacred-white/60 hover:text-sacred-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-sacred-white/60 hover:text-sacred-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-medium mb-4">Connect</h3>
            <p className="text-sacred-white/60 text-sm">
              Join the movement and stay updated on Sacred.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sacred-white/10 text-center text-sm text-sacred-white/60">
          <p>&copy; {new Date().getFullYear()} Sacred. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
