import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Projects() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)

  const [editingProject, setEditingProject] = useState(null)
  const [updating, setUpdating] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  })

  const token = localStorage.getItem('token')

  // Get Projects
  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProjects(response.data.projects || response.data)
    } catch (error) {
      console.error('Projects error:', error)

      setError(
        error.response?.data?.message ||
        'Failed to load projects.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault()

    setCreating(true)
    setError('')

    try {
      await api.post(
        '/projects',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert('Project created successfully!')

      resetForm()
      fetchProjects()

    } catch (error) {
      console.error('Create project error:', error)

      setError(
        error.response?.data?.message ||
        'Failed to create project.'
      )
    } finally {
      setCreating(false)
    }
  }

  // Edit Project
  const handleEdit = (project) => {
    setEditingProject(project)

    setFormData({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'active',
    })

    setShowForm(true)
  }

  // Update Project
  const handleUpdateProject = async (e) => {
    e.preventDefault()

    setUpdating(true)
    setError('')

    try {
      await api.put(
        `/projects/${editingProject._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert('Project updated successfully!')

      resetForm()
      fetchProjects()

    } catch (error) {
      console.error('Update project error:', error)

      setError(
        error.response?.data?.message ||
        'Failed to update project.'
      )
    } finally {
      setUpdating(false)
    }
  }

  // Delete Project
  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await api.delete(
        `/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert('Project deleted successfully!')

      fetchProjects()

    } catch (error) {
      console.error('Delete project error:', error)

      setError(
        error.response?.data?.message ||
        'Failed to delete project.'
      )
    }
  }

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
    })

    setEditingProject(null)
    setShowForm(false)
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="dashboard">

      {/* Navbar */}
      <nav className="navbar">

        <div className="navbar-brand">
          TaskFlow Pro
        </div>

        <div className="navbar-links">

          <button
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/projects')}
          >
            Projects
          </button>

          <button
            onClick={() => navigate('/tasks')}
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

      {/* Main */}
      <main className="dashboard-content">

        {/* Header */}
        <div className="page-header">

          <div>
            <h1>Projects</h1>

            <p>
              Manage your projects from one place.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              if (showForm) {
                resetForm()
              } else {
                setShowForm(true)
              }
            }}
          >
            {showForm
              ? 'Cancel'
              : '+ Create Project'}
          </button>

        </div>

        {/* Error */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Create / Edit Form */}
        {showForm && (
          <div className="form-card">

            <h2>
              {editingProject
                ? 'Edit Project'
                : 'Create New Project'}
            </h2>

            <form
              onSubmit={
                editingProject
                  ? handleUpdateProject
                  : handleCreateProject
              }
            >

              {/* Project Name */}
              <div className="form-group">

                <label htmlFor="name">
                  Project Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Description */}
              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter project description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />

              </div>

              {/* Status */}
              <div className="form-group">

                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="archived">
                    Archived
                  </option>
                </select>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="primary-button"
                disabled={creating || updating}
              >
                {editingProject
                  ? updating
                    ? 'Updating...'
                    : 'Update Project'
                  : creating
                    ? 'Creating...'
                    : 'Create Project'}
              </button>

            </form>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <p>Loading projects...</p>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="empty-state">

              <h2>No Projects Found</h2>

              <p>
                You don't have any projects yet.
              </p>

            </div>
          )}

        {/* Projects */}
        {!loading &&
          projects.length > 0 && (

            <div className="projects-grid">

              {projects.map((project) => (

                <div
                  className="project-card"
                  key={project._id}
                >

                  <h2>
                    {project.name}
                  </h2>

                  <p>
                    {project.description}
                  </p>

                  <span className="project-status">
                    {project.status}
                  </span>

                  {/* Actions */}
                  <div className="project-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(project)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(project._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>
  )
}

export default Projects