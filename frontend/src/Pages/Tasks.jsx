import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Tasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)

  const [editingTask, setEditingTask] = useState(null)
  const [updating, setUpdating] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    project: '',
  })

  const token = localStorage.getItem('token')

  // ========================================
  // GET TASKS
  // ========================================

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setTasks(
        response.data.tasks ||
        response.data
      )

    } catch (error) {
      console.error(
        'Tasks error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to load tasks.'
      )

    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // GET PROJECTS
  // ========================================

  const fetchProjects = async () => {
    try {
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
    }
  }

  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [])

  // ========================================
  // FORM INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // ========================================
  // CREATE TASK
  // ========================================

  const handleCreateTask = async (e) => {
    e.preventDefault()

    setCreating(true)
    setError('')

    try {
      await api.post(
        '/tasks',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert(
        'Task created successfully!'
      )

      resetForm()
      fetchTasks()

    } catch (error) {
      console.error(
        'Create task error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to create task.'
      )

    } finally {
      setCreating(false)
    }
  }

  // ========================================
  // EDIT TASK
  // ========================================

  const handleEdit = (task) => {
    setEditingTask(task)

    setFormData({
      title: task.title || '',

      description:
        task.description || '',

      status:
        task.status || 'todo',

      priority:
        task.priority || 'medium',

      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : '',

      project:
        task.project?._id ||
        task.project ||
        '',
    })

    setShowForm(true)
  }

  // ========================================
  // UPDATE TASK
  // ========================================

  const handleUpdateTask = async (e) => {
    e.preventDefault()

    setUpdating(true)
    setError('')

    try {
      await api.put(
        `/tasks/${editingTask._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert(
        'Task updated successfully!'
      )

      resetForm()
      fetchTasks()

    } catch (error) {
      console.error(
        'Update task error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to update task.'
      )

    } finally {
      setUpdating(false)
    }
  }

  // ========================================
  // DIRECT STATUS UPDATE
  // ========================================

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    try {
      await api.put(
        `/tasks/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Refresh tasks
      fetchTasks()

    } catch (error) {
      console.error(
        'Status update error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to update task status.'
      )
    }
  }

  // ========================================
  // DELETE TASK
  // ========================================

  const handleDelete = async (
    taskId
  ) => {
    const confirmDelete =
      window.confirm(
        'Are you sure you want to delete this task?'
      )

    if (!confirmDelete) {
      return
    }

    try {
      await api.delete(
        `/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert(
        'Task deleted successfully!'
      )

      fetchTasks()

    } catch (error) {
      console.error(
        'Delete task error:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to delete task.'
      )
    }
  }

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      project: '',
    })

    setEditingTask(null)
    setShowForm(false)
  }

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem('token')

    navigate('/login')
  }

  // ========================================
  // UI
  // ========================================

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

        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              Tasks
            </h1>

            <p>
              Manage your tasks and
              track your progress.
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
              : '+ Create Task'}
          </button>

        </div>

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* =========================
            CREATE / EDIT FORM
        ========================== */}

        {showForm && (

          <div className="form-card">

            <h2>

              {editingTask
                ? 'Edit Task'
                : 'Create New Task'}

            </h2>

            <form
              onSubmit={
                editingTask
                  ? handleUpdateTask
                  : handleCreateTask
              }
            >

              {/* TITLE */}

              <div className="form-group">

                <label htmlFor="title">
                  Task Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  rows="4"
                  required
                />

              </div>

              {/* STATUS */}

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

                  <option value="todo">
                    To Do
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                </select>

              </div>

              {/* PRIORITY */}

              <div className="form-group">

                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={
                    formData.priority
                  }
                  onChange={handleChange}
                >

                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                </select>

              </div>

              {/* DUE DATE */}

              <div className="form-group">

                <label htmlFor="dueDate">
                  Due Date
                </label>

                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={
                    formData.dueDate
                  }
                  onChange={handleChange}
                />

              </div>

              {/* PROJECT */}

              <div className="form-group">

                <label htmlFor="project">
                  Project
                </label>

                <select
                  id="project"
                  name="project"
                  value={
                    formData.project
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Project
                  </option>

                  {projects.map(
                    (project) => (

                      <option
                        key={project._id}
                        value={project._id}
                      >
                        {project.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-button"
                disabled={
                  creating ||
                  updating
                }
              >

                {editingTask

                  ? updating
                    ? 'Updating...'
                    : 'Update Task'

                  : creating
                    ? 'Creating...'
                    : 'Create Task'

                }

              </button>

            </form>

          </div>

        )}

        {/* =========================
            LOADING
        ========================== */}

        {loading && (
          <p>
            Loading tasks...
          </p>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          !error &&
          tasks.length === 0 && (

            <div className="empty-state">

              <h2>
                No Tasks Found
              </h2>

              <p>
                You don't have any
                tasks yet.
              </p>

            </div>

          )}

        {/* =========================
            TASKS GRID
        ========================== */}

        {!loading &&
          tasks.length > 0 && (

            <div className="tasks-grid">

              {tasks.map((task) => (

                <div
                  className="task-card"
                  key={task._id}
                >

                  {/* TASK HEADER */}

                  <div className="task-header">

                    <h2>
                      {task.title}
                    </h2>

                    <span
                      className={
                        `priority-${task.priority}`
                      }
                    >
                      {task.priority}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  <p>
                    {task.description}
                  </p>

                  {/* TASK DETAILS */}

                  <div className="task-details">

                    {/* DIRECT STATUS */}

                    <div className="status-control">

                      <label>
                        Status:
                      </label>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="todo">
                          To Do
                        </option>

                        <option value="in-progress">
                          In Progress
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                      </select>

                    </div>

                    {/* DUE DATE */}

                    {task.dueDate && (

                      <span>

                        Due:{' '}

                        {new Date(
                          task.dueDate
                        ).toLocaleDateString()}

                      </span>

                    )}

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="task-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(
                          task._id
                        )
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

export default Tasks