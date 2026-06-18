/**
 * NavTabs.js
 * ----------
 * Center navigation tabs for the navbar.
 *
 * Props:
 *  - activeTab: the tab currently selected
 *  - onTabClick: function from Navbar.js that updates activeTab
 */

import './NavTabs.css'

const tabs = [
  { label: 'Places to stay' },
  { label: 'Experiences' },
  { label: 'Online Experiences' },
]

const NavTabs = ({ activeTab, onTabClick }) => {
  return (
    <nav className="nav-tabs" aria-label="Primary navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label

        return (
          <button
            key={tab.label}
            className={`nav-tab ${isActive ? 'nav-tab--active' : ''}`}
            type="button"
            onClick={() => onTabClick(tab.label)}
          >
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default NavTabs
