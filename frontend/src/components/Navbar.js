/**
 * Navbar.js
 * -----------
 * Top navigation bar on every page.
 * Uses react-router-dom Link so the page does not fully reload.
 */

import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header>
      <div className="container navbar-inner">
        <Link to="/">
          <h1>airbnb</h1>
        </Link>

        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/add">Add listing</Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
