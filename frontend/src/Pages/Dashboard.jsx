import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../Services/api'

function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      // Get Projects and Tasks
      const [projectsResponse, tasksResponse] =
        await Promise.all([
          api.get('/projects', config),
          api.get('/tasks', config),
        ])

      const projects =
        projectsResponse.data.projects ||
        projectsResponse.data ||
        []

      const tasks =
        tasksResponse.data.tasks ||
        tasksResponse.data ||
        []

      // -----------------------------
      // Task Statistics
      // -----------------------------

      const inProgressTasks = tasks.filter(
        (task) => task.status === 'in-progress'
      )

      const completedTasks = tasks.filter(
        (task) => task.status === 'completed'
      )

      // -----------------------------
      // Project Statistics
      // -----------------------------

      const completedProjects = projects.filter(
        (project) => project.status === 'completed'
      )

      // -----------------------------
      // Total Completed
      // Projects + Tasks
      // -----------------------------

      const totalCompleted =
        completedTasks.length +
        completedProjects.length

      // -----------------------------
      // Set Dashboard Statistics
      // -----------------------------

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        inProgress: inProgressTasks.length,
        completed: totalCompleted,
      })

    } catch (error) {
      console.error(
        'Dashboard data error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to load dashboard data.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Load Dashboard Data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="dashboard">

      {/* =========================
          NAVBAR
      ========================== */}

      <nav className="navbar">

        <div className="navbar-brand">
          TaskFlow Pro
        </div>

        <div className="navbar-links">

          <button
            onClick={() =>
              navigate('/dashboard')
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate('/projects')
            }
          >
            Projects
          </button>

          <button
            onClick={() =>
              navigate('/tasks')
            }
          >
            Tasks
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="dashboard-content">

        {/* Welcome Section */}

        <section className="welcome-section">

          <h1>
            Welcome to TaskFlow Pro 👋
          </h1>

          <p>
            Manage your projects and tasks
            efficiently from one place.
          </p>

        </section>

        {/* =========================
            ERROR MESSAGE
        ========================== */}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* =========================
            STATISTICS
        ========================== */}

        <section className="stats-grid">

          {/* Total Projects */}

          <div className="stat-card">

            <h3>
              Total Projects
            </h3>

            <p>
              {loading
                ? '...'
                : stats.totalProjects}
            </p>

          </div>

          {/* Total Tasks */}

          <div className="stat-card">

            <h3>
              Total Tasks
            </h3>

            <p>
              {loading
                ? '...'
                : stats.totalTasks}
            </p>

          </div>

          {/* In Progress */}

          <div className="stat-card">

            <h3>
              In Progress
            </h3>

            <p>
              {loading
                ? '...'
                : stats.inProgress}
            </p>

          </div>

          {/* Completed */}

          <div className="stat-card">

            <h3>
              Completed
            </h3>

            <p>
              {loading
                ? '...'
                : stats.completed}
            </p>

          </div>

        </section>

        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <section className="quick-actions">

          <h2>
            Quick Actions
          </h2>

          <div className="action-buttons">

            <button
              onClick={() =>
                navigate('/projects')
              }
            >
              + Manage Projects
            </button>

            <button
              onClick={() =>
                navigate('/tasks')
              }
            >
              + Manage Tasks
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard