import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import authService from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(email, password)
      localStorage.setItem('authToken', response.token)
      login(response.user)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <p className="auth-badge">CIIT Marketplace</p>
          <h1>Welcome back</h1>
          <p className="auth-subtext">
            Log in to browse listings, post items, and connect with other CIIT
            students.
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            <div className="form-group">
              <label htmlFor="login-email">CIIT Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="youremail@ciit.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-feature-card">
            <h2>Student-only marketplace</h2>
            <p>
              Access a secure campus buying and selling platform designed for
              the CIIT community.
            </p>

            <ul className="auth-feature-list">
              <li>Post and manage listings</li>
              <li>Find affordable student deals</li>
              <li>Message buyers and sellers</li>
              <li>Use your CIIT email to sign in</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login