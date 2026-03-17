import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">CIIT Marketplace</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/messages">Messages</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="nav-btn secondary-nav-btn">
          Log In
        </Link>

        <Link to="/register" className="nav-btn primary-nav-btn">
          Sign Up
        </Link>
      </div>
    </nav>
  )
}

export default Navbar