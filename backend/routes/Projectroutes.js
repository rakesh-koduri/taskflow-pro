const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create project
router.post("/", protect, createProject);

// Get all projects
router.get("/", protect, getProjects);

// Get single project
router.get("/:id", protect, getProjectById);

// Update project
router.put("/:id", protect, updateProject);

// Delete project
router.delete("/:id", protect, deleteProject);

module.exports = router;