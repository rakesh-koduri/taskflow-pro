const Project = require("../models/Project");

// =====================================
// CREATE PROJECT
// =====================================
const createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      owner: req.user.userId
    });

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// GET ALL PROJECTS
// =====================================
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// GET SINGLE PROJECT
// =====================================
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      project
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// UPDATE PROJECT
// =====================================
const updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (name !== undefined) {
      project.name = name;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (status !== undefined) {
      project.status = status;
    }

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// DELETE PROJECT
// =====================================
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================
// EXPORT
// =====================================
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};