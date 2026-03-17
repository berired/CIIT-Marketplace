import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="logo">CIIT Marketplace</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        {user && <Link to="/create-listing">Sell</Link>}
        <Link to="/messages">Messages</Link>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/profile" className="nav-btn secondary-nav-btn">
              {user.fullName}
            </Link>
            <button 
              onClick={handleLogout}
              className="nav-btn primary-nav-btn"
              style={{ cursor: 'pointer', border: 'none', background: 'inherit' }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn secondary-nav-btn">
              Log In
            </Link>
            <Link to="/register" className="nav-btn primary-nav-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar