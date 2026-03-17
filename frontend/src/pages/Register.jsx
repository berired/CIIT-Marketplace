import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import authService from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id.replace('register-', '')]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await authService.register(
        formData.email,
        formData.password,
        formData.fullName
      )
      localStorage.setItem('authToken', response.token)
      login(response.user)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <p className="auth-badge">CIIT Marketplace</p>
          <h1>Create your account</h1>
          <p className="auth-subtext">
            Register with your CIIT email to start buying and selling inside the
            campus community.
          </p>

          <form className="auth-form" onSubmit={handleRegister}>
            {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            
            <div className="form-group">
              <label htmlFor="register-fullName">Full Name</label>
              <input
                id="register-fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">CIIT Email</label>
              <input
                id="register-email"
                type="email"
                placeholder="youremail@ciit.edu.ph"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <small className="input-note">
                Only CIIT email addresses are allowed.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-confirmPassword">
                Confirm Password
              </label>
              <input
                id="register-confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-feature-card">
            <h2>Join the CIIT community marketplace</h2>
            <p>
              Buy and sell school items, gadgets, clothing, and more with
              fellow students.
            </p>

            <ul className="auth-feature-list">
              <li>CIIT email-based registration</li>
              <li>Secure student access</li>
              <li>Easy posting and browsing</li>
              <li>Campus-focused transactions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register