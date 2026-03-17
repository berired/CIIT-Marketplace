import { Link } from 'react-router-dom'

function Login() {
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

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">CIIT Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="youremail@ciit.edu.ph"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <button className="auth-submit-btn" type="submit">
              Log In
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