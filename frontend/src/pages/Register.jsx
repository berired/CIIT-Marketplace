import { Link } from 'react-router-dom'

function Register() {
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

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">CIIT Email</label>
              <input
                id="register-email"
                type="email"
                placeholder="youremail@ciit.edu.ph"
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            <button className="auth-submit-btn" type="submit">
              Create Account
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