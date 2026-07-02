/**
 * Navbar.js
 
 *  - activeTab stores which top navigation link was clicked.
 *  - NavTabs renders the center links.
 *  - isScrolled becomes true after the user scrolls down about 80px.
 *  - SearchBar renders the large pill-shaped search area below the links.
 *  - The compact search pill appears in the center when isScrolled is true.
 *  - SearchBar navigates to /accommodations when a destination is chosen.
 *  - The profile icon opens a small menu with Log in / Sign up links.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiGlobe, FiMenu, FiUser } from 'react-icons/fi'
import { useAccommodationContext } from '../hooks/useAccommodationContext'
import { useAuthContext } from '../hooks/useAuthContext'
import NavTabs from './NavTabs'
import SearchBar from './SearchBar'
import './Navbar.css'


const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Places to stay')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const { dispatch } = useAccommodationContext()
  const { user, dispatch: authDispatch } = useAuthContext()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close the profile menu when the user clicks somewhere else on the page
  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    const handleClickOutside = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleSearch = (searchParams) => {
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: searchParams })
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((open) => !open)
  }

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    authDispatch({ type: 'LOGOUT' })
    closeProfileMenu()
  }

  return (
    <header className={`airbnb-navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
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
          <div className="airbnb-nav-tabs-wrap">
            <NavTabs
              activeTab={activeTab}
              onTabClick={setActiveTab}
            />
          </div>

          <button
            className="compact-search-pill"
            type="button"
            aria-label="Open compact search"
          >
            <span className="compact-search-icon" aria-hidden="true">
              🏠
            </span>
            <span className="compact-search-item">Anywhere</span>
            <span className="compact-search-divider" aria-hidden="true" />
            <span className="compact-search-item">Anytime</span>
            <span className="compact-search-divider" aria-hidden="true" />
            <span className="compact-search-item compact-search-item--muted">
              Add guests
            </span>
            <span className="compact-search-button" aria-hidden="true">
              🔍
            </span>
          </button>
        </div>

        {/* Right: host link, language button, and profile menu */}
        <div className="airbnb-navbar-right">
          <Link to="/add" className="airbnb-host-link">
            Become a host
          </Link>

          <button className="airbnb-icon-button" type="button" aria-label="Choose language">
            <FiGlobe />
          </button>

          <div className="airbnb-profile-menu-wrap" ref={profileMenuRef}>
            <button
              className="airbnb-profile-menu"
              type="button"
              aria-label="Open profile menu"
              aria-expanded={isProfileMenuOpen}
              onClick={toggleProfileMenu}
            >
              <FiMenu />
              <span className="airbnb-user-avatar">
                <FiUser />
              </span>
            </button>

            {isProfileMenuOpen && (
              <div className="airbnb-profile-dropdown">
                {user ? (
                  <>
                    <p className="airbnb-profile-email">{user.email}</p>
                    <button
                      className="airbnb-profile-dropdown-item"
                      type="button"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="airbnb-profile-dropdown-item"
                      onClick={closeProfileMenu}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="airbnb-profile-dropdown-item"
                      onClick={closeProfileMenu}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
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
