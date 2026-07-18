/**
 * App.js
 * ------
 * Root component of the React app.
 *
 * Routes:
 *  /                        → Home (marketing sections only)
 *  /accommodations          → Browse all / filter by city
 *  /accommodations/:id      → Listing details + booking
 *  /add                     → Create listing (auth)
 *  /admin                   → Host dashboard (auth)
 *  /admin/listings          → View own listings (auth)
 *  /admin/listings/:id/edit → Update listing (auth)
 *  /reservations            → Guest bookings (auth)
 *  /login, /signup          → Authentication
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AccommodationContextProvider } from './context/AccommodationContext'
import AccommodationsPage from './pages/AccommodationsPage/AccommodationsPage'
import AccommodationDetailPage from './pages/AccommodationDetailPage/AccommodationDetailPage'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import MyListingsPage from './pages/MyListingsPage/MyListingsPage'
import EditListingPage from './pages/EditListingPage/EditListingPage'
import ReservationsPage from './pages/ReservationsPage/ReservationsPage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import AccommodationForm from './components/AccommodationForm'
import HeroBanner from './components/HeroBanner'
import TripInspiration from './components/TripInspiration/TripInspiration'
import DiscoverExperiences from './components/DiscoverExperiences/DiscoverExperiences'
import GiftCards from './components/GiftCards/GiftCards'
import HostingCTA from './components/HostingCTA/HostingCTA'
import FutureGetaways from './components/FutureGetaways/FutureGetaways'
import Footer from './components/Footer/Footer'
import { useAuthContext } from './hooks/useAuthContext'

/** Only logged-in users can see this page — otherwise send to /login */
function RequireAuth({ children }) {
  const { user } = useAuthContext()
  return user ? children : <Navigate to="/login" />
}

function App() {
  const { user } = useAuthContext()

  return (
    <AccommodationContextProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />

          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <HeroBanner />
                    <TripInspiration />
                    <DiscoverExperiences />
                    <GiftCards />
                    <HostingCTA />
                    <FutureGetaways />
                  </>
                }
              />

              <Route path="/accommodations" element={<AccommodationsPage />} />
              <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />

              <Route path="/add" element={<RequireAuth><AccommodationForm /></RequireAuth>} />

              <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
              <Route path="/admin/listings" element={<RequireAuth><MyListingsPage /></RequireAuth>} />
              <Route
                path="/admin/listings/:id/edit"
                element={<RequireAuth><EditListingPage /></RequireAuth>}
              />

              <Route path="/reservations" element={<RequireAuth><ReservationsPage /></RequireAuth>} />

              <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/admin" />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AccommodationContextProvider>
  )
}

export default App
