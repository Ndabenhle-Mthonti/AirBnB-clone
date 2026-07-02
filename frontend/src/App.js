/**
 * App.js
 * ------
 * Root component of the React app.
 *
 * Structure:
 *  AccommodationContextProvider → shares API data with all pages
 *  BrowserRouter → handles URL routes (/ and /add)
 *  Navbar → navigation links
 *  Routes → which page component to show
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AccommodationContextProvider } from './context/AccommodationContext'
import AccommodationsPage from './pages/AccommodationsPage/AccommodationsPage'
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

function App() {
  const { user } = useAuthContext()
  return (
    <AccommodationContextProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />

          <div className="pages">
            <Routes>
              {/* GET /api/airbnbs — list all accommodations */}
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

              {/* POST /api/airbnbs — create a new accommodation */}
              <Route
                path="/add"
                element={user ? <AccommodationForm /> : <Navigate to="/login" />}
              />

              {/* POST /api/user/signup — create a new account */}
              <Route path="/signup" element={ !user ?<Signup /> : <Navigate to = "/"/>} />

              {/* POST /api/user/login — log in to an existing account */}
              <Route path="/login" element={ !user ?<Login /> : <Navigate to = "/"/>} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AccommodationContextProvider>
  )
}

export default App
