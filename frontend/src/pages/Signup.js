/**
 * Signup.js
 * ---------
 * Simple signup page — uses the useSignup hook for the API call.
 *
 * Beginner notes:
 *  - useState stores what the user types in the form fields.
 *  - useSignup handles fetch, errors, loading, and auth context.
 *  - handleSubmit runs when the form is submitted (Sign up button or Enter key).
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignup } from '../hooks/useSignup'
import './Signup.css'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signup, error, isLoading } = useSignup()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const success = await signup(email, password)

    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Create your account</h2>
        <p className="signup-hint">
          Password must be at least 8 characters and include uppercase,
          lowercase, a number, and a symbol.
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="TestPass1!"
            autoComplete="new-password"
          />

          {error && <p className="signup-error">{error}</p>}

          <button className="signup-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
