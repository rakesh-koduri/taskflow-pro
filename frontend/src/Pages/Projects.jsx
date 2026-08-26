import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Archive,
  CircleDot,
  X,
  ArrowRight
} from 'lucide-react'

import api from '../Services/api'
import Navbar from '../Components/Navbar'

import './Projects.css'

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

  // ========================================
  // GET PROJECTS
  // ========================================

  const fetchProjects = async () => {
    try {
      setLoading(true)

      const response = await api.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProjects(
        response.data.projects ||
        response.data
      )

    } catch (error) {
      console.error(
        'Projects error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to load projects.'
      )

    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // LOAD PROJECTS
  // ========================================

  useEffect(() => {
    fetchProjects()
  }, [])

  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // ========================================
  // CREATE PROJECT
  // ========================================

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
      console.error(
        'Create project error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to create project.'
      )

    } finally {
      setCreating(false)
    }
  }

  // ========================================
  // EDIT PROJECT
  // ========================================

  const handleEdit = (project) => {
    setEditingProject(project)

    setFormData({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'active',
    })

    setShowForm(true)
  }

  // ========================================
  // UPDATE PROJECT
  // ========================================

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
      console.error(
        'Update project error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to update project.'
      )

    } finally {
      setUpdating(false)
    }
  }

  // ========================================
  // STATUS UPDATE
  // ========================================

  const handleStatusChange = async (
    projectId,
    newStatus
  ) => {
    try {
      await api.put(
        `/projects/${projectId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      fetchProjects()

    } catch (error) {
      console.error(
        'Status update error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to update project status.'
      )
    }
  }

  // ========================================
  // DELETE PROJECT
  // ========================================

  const handleDelete = async (projectId) => {
    const confirmDelete =
      window.confirm(
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
      console.error(
        'Delete project error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to delete project.'
      )
    }
  }

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
    })

    setEditingProject(null)
    setShowForm(false)
  }

  // ========================================
  // STATUS ICON
  // ========================================

  const getStatusIcon = (status) => {
    if (status === 'completed') {
      return <CheckCircle2 size={14} />
    }

    if (status === 'archived') {
      return <Archive size={14} />
    }

    return <CircleDot size={14} />
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="projects-page">

      {/* SIDEBAR */}

      <Navbar />

      {/* MAIN */}

      <main className="projects-content">

        {/* PAGE HEADER */}

        <section className="projects-header">

          <div>

            <span className="projects-eyebrow">
              WORKSPACE
            </span>

            <h1>
              Projects
            </h1>

            <p>
              Organize and manage all your
              projects in one place.
            </p>

          </div>

          <button
            className="create-project-button"
            onClick={() => {

              if (showForm) {
                resetForm()
              } else {
                setShowForm(true)
              }

            }}
          >

            {showForm ? (
              <>
                <X size={17} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={17} />
                New Project
              </>
            )}

          </button>

        </section>

        {/* ERROR */}

        {error && (
          <div className="projects-error">
            {error}
          </div>
        )}

        {/* CREATE / EDIT FORM */}

        {showForm && (

          <section className="project-form-card">

            <div className="form-heading">

              <div className="form-icon">
                <FolderKanban size={20} />
              </div>

              <div>

                <h2>
                  {editingProject
                    ? 'Edit Project'
                    : 'Create New Project'}
                </h2>

                <p>
                  {editingProject
                    ? 'Update your project details.'
                    : 'Add a new project to your workspace.'}
                </p>

              </div>

            </div>

            <form
              onSubmit={
                editingProject
                  ? handleUpdateProject
                  : handleCreateProject
              }
            >

              <div className="form-row">

                {/* NAME */}

                <div className="projects-form-group">

                  <label htmlFor="name">
                    Project Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="e.g. Website Redesign"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* STATUS */}

                <div className="projects-form-group">

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

              </div>

              {/* DESCRIPTION */}

              <div className="projects-form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe what this project is about..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-form-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-project-button"
                  disabled={
                    creating ||
                    updating
                  }
                >

                  {editingProject
                    ? updating
                      ? 'Updating...'
                      : 'Update Project'
                    : creating
                      ? 'Creating...'
                      : 'Create Project'}

                </button>

              </div>

            </form>

          </section>

        )}

        {/* PROJECT COUNT */}

        {!loading &&
          !error &&
          projects.length > 0 && (

            <div className="projects-toolbar">

              <div>

                <span>
                  YOUR PROJECTS
                </span>

                <strong>
                  {projects.length}
                </strong>

              </div>

              <p>
                Active workspace
              </p>

            </div>

          )}

        {/* LOADING */}

        {loading && (

          <div className="projects-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading projects...
            </p>

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          projects.length === 0 && (

            <div className="projects-empty">

              <div className="empty-project-icon">
                <FolderKanban size={28} />
              </div>

              <h2>
                No projects yet
              </h2>

              <p>
                Create your first project and
                start organizing your work.
              </p>

              <button
                onClick={() =>
                  setShowForm(true)
                }
              >
                <Plus size={17} />
                Create Your First Project
              </button>

            </div>

          )}

        {/* PROJECT GRID */}

        {!loading &&
          projects.length > 0 && (

            <section className="projects-grid">

              {projects.map((project) => (

                <article
                  className="professional-project-card"
                  key={project._id}
                >

                  {/* CARD TOP */}

                  <div className="project-card-top">

                    <div className="project-card-icon">
                      <FolderKanban size={19} />
                    </div>

                    <div className="project-status">

                      {getStatusIcon(project.status)}

                      <span>
                        {project.status}
                      </span>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="project-card-content">

                    <h2>
                      {project.name}
                    </h2>

                    <p>
                      {project.description ||
                        'No description available.'}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="project-status-section">

                    <label>
                      PROJECT STATUS
                    </label>

                    <select
                      value={project.status}
                      onChange={(e) =>
                        handleStatusChange(
                          project._id,
                          e.target.value
                        )
                      }
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

                  {/* ACTIONS */}

                  <div className="project-card-actions">

                    <button
                      className="project-edit-button"
                      onClick={() =>
                        handleEdit(project)
                      }
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      className="project-delete-button"
                      onClick={() =>
                        handleDelete(
                          project._id
                        )
                      }
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                    <button
                      className="project-arrow-button"
                      onClick={() =>
                        navigate('/projects')
                      }
                    >
                      <ArrowRight size={16} />
                    </button>

                  </div>

                </article>

              ))}

            </section>

          )}

      </main>

    </div>
  )
}

export default Projects