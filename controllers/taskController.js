const Task = require("../models/task");

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve task" });
  }
};

const getAllTasks = async (_req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};

const updateTask = async (req, res) => {
  try {
    const updated = await Task.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = { createTask, getTask, getAllTasks, updateTask, deleteTask };
