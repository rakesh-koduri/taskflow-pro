import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  FolderKanban,
  CheckSquare,
  Clock3,
  CircleCheck,
  ArrowRight,
  Plus,
  AlertCircle,
  CalendarDays
} from 'lucide-react'

import api from '../Services/api'
import Navbar from '../Components/Navbar'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
  })

  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ========================================
  // FETCH DASHBOARD DATA
  // ========================================

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const [projectsResponse, tasksResponse] =
        await Promise.all([
          api.get('/projects', config),
          api.get('/tasks', config),
        ])

      const projectData =
        projectsResponse.data.projects ||
        projectsResponse.data ||
        []

      const taskData =
        tasksResponse.data.tasks ||
        tasksResponse.data ||
        []

      setProjects(projectData)
      setTasks(taskData)

      // ========================================
      // TASK STATISTICS
      // ========================================

      const inProgressTasks = taskData.filter(
        (task) => task.status === 'in-progress'
      )

      const completedTasks = taskData.filter(
        (task) => task.status === 'completed'
      )

      // ========================================
      // PROJECT STATISTICS
      // ========================================

      const completedProjects = projectData.filter(
        (project) => project.status === 'completed'
      )

      const totalCompleted =
        completedTasks.length +
        completedProjects.length

      setStats({
        totalProjects: projectData.length,
        totalTasks: taskData.length,
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

  // ========================================
  // LOAD DASHBOARD
  // ========================================

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="dashboard">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <Navbar />

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="dashboard-content">

        {/* =====================================
            WELCOME
        ====================================== */}

        <section className="welcome-section">

          <div>

            <span className="welcome-label">
              OVERVIEW
            </span>

            <h1>
              Welcome back, Rakesh 👋
            </h1>

            <p>
              Here's what's happening with your
              projects and tasks today.
            </p>

          </div>

          <div className="welcome-action">

            <button
              className="primary-action"
              onClick={() =>
                navigate('/projects')
              }
            >
              <Plus size={18} />
              New Project
            </button>

          </div>

        </section>

        {/* =====================================
            ERROR
        ====================================== */}

        {error && (
          <div className="error-message">

            <AlertCircle size={18} />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* =====================================
            STATISTICS
        ====================================== */}

        <section className="stats-grid">

          {/* TOTAL PROJECTS */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon projects-icon">
                <FolderKanban size={21} />
              </div>

              <span className="stat-label">
                PROJECTS
              </span>

            </div>

            <div className="stat-value">
              {loading
                ? '...'
                : stats.totalProjects}
            </div>

            <p className="stat-description">
              Total projects
            </p>

          </div>

          {/* TOTAL TASKS */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon tasks-icon">
                <CheckSquare size={21} />
              </div>

              <span className="stat-label">
                TASKS
              </span>

            </div>

            <div className="stat-value">
              {loading
                ? '...'
                : stats.totalTasks}
            </div>

            <p className="stat-description">
              Total tasks
            </p>

          </div>

          {/* IN PROGRESS */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon progress-icon">
                <Clock3 size={21} />
              </div>

              <span className="stat-label">
                IN PROGRESS
              </span>

            </div>

            <div className="stat-value">
              {loading
                ? '...'
                : stats.inProgress}
            </div>

            <p className="stat-description">
              Active tasks
            </p>

          </div>

          {/* COMPLETED */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon completed-icon">
                <CircleCheck size={21} />
              </div>

              <span className="stat-label">
                COMPLETED
              </span>

            </div>

            <div className="stat-value">
              {loading
                ? '...'
                : stats.completed}
            </div>

            <p className="stat-description">
              Completed items
            </p>

          </div>

        </section>

        {/* =====================================
            RECENT PROJECTS
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <span className="section-label">
                WORKSPACE
              </span>

              <h2>
                Recent Projects
              </h2>

            </div>

            <button
              className="view-all-button"
              onClick={() =>
                navigate('/projects')
              }
            >
              View all
              <ArrowRight size={16} />
            </button>

          </div>

          {loading ? (

            <div className="loading-card">
              Loading projects...
            </div>

          ) : projects.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                <FolderKanban size={25} />
              </div>

              <h3>
                No projects yet
              </h3>

              <p>
                Create your first project to
                get started.
              </p>

              <button
                onClick={() =>
                  navigate('/projects')
                }
              >
                <Plus size={17} />
                Create Project
              </button>

            </div>

          ) : (

            <div className="recent-grid">

              {projects
                .slice(-3)
                .reverse()
                .map((project) => (

                  <div
                    className="recent-card project-card"
                    key={project._id}
                  >

                    <div className="recent-card-header">

                      <div className="card-title-area">

                        <div className="small-card-icon">
                          <FolderKanban size={17} />
                        </div>

                        <h3>
                          {project.name}
                        </h3>

                      </div>

                      <span
                        className={`status-badge ${project.status}`}
                      >
                        {project.status}
                      </span>

                    </div>

                    <p className="card-description">
                      {project.description ||
                        'No description available.'}
                    </p>

                    <div className="card-footer">

                      <span>
                        Project
                      </span>

                      <ArrowRight size={15} />

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* =====================================
            RECENT TASKS
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <span className="section-label">
                PRODUCTIVITY
              </span>

              <h2>
                Recent Tasks
              </h2>

            </div>

            <button
              className="view-all-button"
              onClick={() =>
                navigate('/tasks')
              }
            >
              View all
              <ArrowRight size={16} />
            </button>

          </div>

          {loading ? (

            <div className="loading-card">
              Loading tasks...
            </div>

          ) : tasks.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                <CheckSquare size={25} />
              </div>

              <h3>
                No tasks yet
              </h3>

              <p>
                Create a task to start tracking
                your work.
              </p>

              <button
                onClick={() =>
                  navigate('/tasks')
                }
              >
                <Plus size={17} />
                Create Task
              </button>

            </div>

          ) : (

            <div className="recent-grid">

              {tasks
                .slice(-3)
                .reverse()
                .map((task) => (

                  <div
                    className="recent-card task-card"
                    key={task._id}
                  >

                    <div className="recent-card-header">

                      <div className="card-title-area">

                        <div className="small-card-icon">
                          <CheckSquare size={17} />
                        </div>

                        <h3>
                          {task.title}
                        </h3>

                      </div>

                      <span
                        className={`status-badge ${task.status}`}
                      >
                        {task.status}
                      </span>

                    </div>

                    <p className="card-description">
                      {task.description ||
                        'No description available.'}
                    </p>

                    <div className="task-meta">

                      <div className="task-meta-item">

                        <span>
                          Priority
                        </span>

                        <strong
                          className={`priority-${task.priority}`}
                        >
                          {task.priority}
                        </strong>

                      </div>

                      {task.dueDate && (

                        <div className="task-meta-item">

                          <span>
                            Due date
                          </span>

                          <strong>
                            <CalendarDays
                              size={14}
                            />

                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}
                          </strong>

                        </div>

                      )}

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <section className="quick-actions">

          <div>

            <span className="section-label">
              GET STARTED
            </span>

            <h2>
              Quick Actions
            </h2>

            <p>
              Manage your workspace efficiently.
            </p>

          </div>

          <div className="action-buttons">

            <button
              onClick={() =>
                navigate('/projects')
              }
            >
              <FolderKanban size={18} />
              Manage Projects
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() =>
                navigate('/tasks')
              }
            >
              <CheckSquare size={18} />
              Manage Tasks
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard