import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: CheckSquare
    }
  ]

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? 'sidebar-open' : ''
        }`}
      >

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="brand-icon">
            TF
          </div>

          <div>
            <h2>TaskFlow</h2>
            <span>PRO</span>
          </div>

        </div>

        {/* NAVIGATION */}

        <div className="sidebar-section-title">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          {navItems.map((item) => {

            const Icon = item.icon

            const active =
              location.pathname === item.path

            return (
              <button
                key={item.path}
                className={`sidebar-link ${
                  active ? 'active' : ''
                }`}
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false)
                }}
              >

                <Icon size={19} />

                <span>
                  {item.name}
                </span>

              </button>
            )
          })}

        </nav>

        {/* OTHER */}

        <div className="sidebar-section-title">
          OTHER
        </div>

        <button className="sidebar-link">
          <Settings size={19} />
          <span>Settings</span>
        </button>

        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-profile">

            <div className="profile-avatar">
              <User size={18} />
            </div>

            <div className="profile-info">
              <strong>Rakesh</strong>
              <span>Administrator</span>
            </div>

            <Bell size={18} className="profile-bell" />

          </div>

          <button
            className="logout-link"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  )
}

export default Navbar