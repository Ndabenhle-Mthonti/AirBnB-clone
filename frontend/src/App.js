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

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AccommodationContextProvider } from './context/AccommodationContext'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import AccommodationForm from './components/AccommodationForm'

function App() {
  return (
    <AccommodationContextProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />

          <div className="pages">
            <Routes>
              {/* GET /api/airbnbs — list all accommodations */}
              <Route path="/" element={<Home />} />

              {/* POST /api/airbnbs — create a new accommodation */}
              <Route path="/add" element={<AccommodationForm />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </AccommodationContextProvider>
  )
}

export default App
