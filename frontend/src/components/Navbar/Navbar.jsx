import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Navbar.css'
import { useState } from 'react'
function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

return (
    <nav className="navbar">
      <div className="logo">CIIT Marketplace</div>

      {/* 1. The Hamburger Button (Mobile Only) */}
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      {/* 2. Wrap links and actions in a mobile-responsive container */}
      <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="nav-links">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/listings" onClick={closeMenu}>Listings</Link>
          {user && <Link to="/create-listing" onClick={closeMenu}>Sell</Link>}
          <Link to="/messages" onClick={closeMenu}>Messages</Link>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/profile" className="nav-btn secondary-nav-btn" onClick={closeMenu}>
                {user.fullName}
              </Link>
              <button 
                onClick={handleLogout}
                className="nav-btn primary-nav-btn"
                style={{ cursor: 'pointer' }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn secondary-nav-btn" onClick={closeMenu}>
                Log In
              </Link>
              <Link to="/register" className="nav-btn primary-nav-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar