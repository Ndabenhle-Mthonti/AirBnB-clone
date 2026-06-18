/**
 * Navbar.js
 * ---------
 * Old Airbnb-style navigation component.
 *
 * Beginner notes:
 *  - activeTab stores which top navigation link was clicked.
 *  - NavTabs renders the center links.
 *  - SearchBar renders the large pill-shaped search area below the links.
 *  - Search results are sent to context so Home.js can filter listings.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiGlobe, FiMenu, FiUser } from 'react-icons/fi'
import { useAccommodationContext } from '../hooks/useAccommodationContext'
import NavTabs from './NavTabs'
import SearchBar from './SearchBar'
import './Navbar.css'

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Places to stay')
  const { dispatch } = useAccommodationContext()

  const handleSearch = (searchParams) => {
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: searchParams })
  }

  return (
    <header className="airbnb-navbar">
      <div className="airbnb-navbar-top">
        {/* Left: Airbnb logo and wordmark */}
        <div className="airbnb-navbar-left">
          <Link to="/" className="airbnb-brand" aria-label="Airbnb home">
            <svg
              className="airbnb-brand-icon"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M16 3.5C12.9 3.5 10.6 6 8.5 10.2L3.7 20C1.9 23.7 4.5 28 8.6 28c2.6 0 4.9-1.5 7.4-4.4 2.5 2.9 4.8 4.4 7.4 4.4 4.1 0 6.7-4.3 4.9-8L23.5 10.2C21.4 6 19.1 3.5 16 3.5Zm0 4c1.5 0 2.9 1.7 4.1 4.2l1 2.1c-1.8.7-3.4 1.9-5.1 3.8-1.7-1.9-3.3-3.1-5.1-3.8l1-2.1C13.1 9.2 14.5 7.5 16 7.5Zm-7.4 16.8c-1.4 0-2.3-1.5-1.7-2.8l2.2-4.6c1.4.5 2.7 1.6 4.2 3.4-1.8 2.4-3.4 4-4.7 4Zm14.8 0c-1.3 0-2.9-1.6-4.7-4 1.5-1.8 2.8-2.9 4.2-3.4l2.2 4.6c.6 1.3-.3 2.8-1.7 2.8Z" />
            </svg>
            <span className="airbnb-brand-text">airbnb</span>
          </Link>
        </div>

        {/* Center: old Airbnb navigation links */}
        <div className="airbnb-navbar-center">
          <NavTabs
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />
        </div>

        {/* Right: host link, language button, and profile menu */}
        <div className="airbnb-navbar-right">
          <Link to="/add" className="airbnb-host-link">
            Become a host
          </Link>

          <button className="airbnb-icon-button" type="button" aria-label="Choose language">
            <FiGlobe />
          </button>

          <button className="airbnb-profile-menu" type="button" aria-label="Open profile menu">
            <FiMenu />
            <span className="airbnb-user-avatar">
              <FiUser />
            </span>
          </button>
        </div>
      </div>

      {/* Search bar sits below the navigation links */}
      <div className="airbnb-search-area">
        <SearchBar onSearch={handleSearch} />
      </div>
    </header>
  )
}

export default Navbar
