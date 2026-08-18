const Task = require("../models/Task");
const Project = require("../models/Project");

// =====================================
// CREATE TASK
// =====================================
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    if (!project) {
      return res.status(400).json({
        message: "Project ID is required"
      });
    }

    // Check whether project belongs to logged-in user
    const existingProject = await Project.findOne({
      _id: project,
      owner: req.user.userId
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      owner: req.user.userId
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// GET ALL TASKS
// =====================================
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user.userId
    })
      .populate("project", "name status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// GET SINGLE TASK
// =====================================
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.userId
    }).populate("project", "name status");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      task
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// UPDATE TASK
// =====================================
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project
    } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // If project is being changed, verify new project
    if (project !== undefined) {
      const existingProject = await Project.findOne({
        _id: project,
        owner: req.user.userId
      });

      if (!existingProject) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      task.project = project;
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// DELETE TASK
// =====================================
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};