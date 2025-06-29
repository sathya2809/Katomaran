const express = require("express");
const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/user/:id", getUser); // GET /user/:id
router.get("/users", getAllUsers); // GET /users
router.post("/user", createUser); // POST /user
router.put("/user/:id", updateUser); // PUT /user/:id
router.delete("/user/:id", deleteUser); // DELETE /user/:id

router.get("/task/:id", getTask); // GET /task/:id
router.get("/tasks", getAllTasks); // GET /tasks
router.post("/task", createTask); // POST /task
router.put("/task/:id", updateTask); // PUT /task/:id
router.delete("/task/:id", deleteTask); // DELETE /task/:id

module.exports = router;
