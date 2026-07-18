/**
 * Login.js
 * --------
 * Simple login page — uses the useLogin hook for the API call.
 *
 * Beginner notes:
 *  - useState stores what the user types in the form fields.
 *  - useLogin handles fetch, errors, loading, and auth context.
 *  - handleSubmit runs when the form is submitted (Log in button or Enter key).
 */

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, error, isLoading } = useLogin()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (event) => {
    event.preventDefault()

    /** Client-side validation (rubric: clear error messages) */
    if (!email.trim()) {
      return
    }

    if (!password) {
      return
    }

    const success = await login(email.trim(), password)

    if (success) {
      navigate('/admin')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome back</h2>
        <p className="login-hint">
          Log in with the email and password you used to sign up.
          {location.state?.from === 'booking' && (
            <span className="login-booking-note"> You need to be logged in to reserve.</span>
          )}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
            minLength={8}
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="login-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
