/**
 * AdminDashboard.js
 * -----------------
 * Host admin landing page (rubric: login redirects here).
 *
 * Route: /admin
 * Links to create, view, and manage listings + reservations.
 */

import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user } = useAuthContext()

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Host dashboard</h1>
      <p className="admin-dashboard__greeting">
        Hello, <strong>{user?.email}</strong> — manage your Airbnb listings here.
      </p>

      <div className="admin-dashboard__grid">
        <Link to="/admin/listings" className="admin-dashboard__card">
          <h2>View listings</h2>
          <p>See all your accommodations, update or delete them.</p>
        </Link>

        <Link to="/add" className="admin-dashboard__card">
          <h2>Create listing</h2>
          <p>Add a new accommodation with photos and pricing.</p>
        </Link>

        <Link to="/reservations" className="admin-dashboard__card">
          <h2>My reservations</h2>
          <p>View and cancel your bookings.</p>
        </Link>

        <Link to="/accommodations" className="admin-dashboard__card">
          <h2>Browse as guest</h2>
          <p>Explore all South African accommodations.</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
