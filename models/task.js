const db = require("../database/db");

const Task = {};

// Simple validation helper
function validateTaskInput(task, requiredFields = []) {
  for (const field of requiredFields) {
    if (task[field] === undefined || task[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

Task.create = async (task) => {
  try {
    validateTaskInput(task, [
      "owner_id",
      "title",
      "description",
      "due_date",
      "created_by",
    ]);
    const {
      owner_id,
      title,
      description,
      due_date,
      priority = 0,
      created_by,
    } = task;
    const result = await db.query(
      `INSERT INTO tasks (owner_id, title, description, due_date, priority, created_by)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [owner_id, title, description, due_date, priority, created_by]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Task creation failed: ${err.message}`);
  }
};

Task.getById = async (id) => {
  try {
    if (!id) throw new Error("Task ID is required");
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Get task by ID failed: ${err.message}`);
  }
};

Task.getAll = async () => {
  try {
    const result = await db.query("SELECT * FROM tasks");
    return result.rows;
  } catch (err) {
    throw new Error(`Get all tasks failed: ${err.message}`);
  }
};

Task.update = async (id, data) => {
  try {
    if (!id) throw new Error("Task ID is required");
    validateTaskInput(data, [
      "title",
      "description",
      "due_date",
      "is_completed",
      "priority",
      "updated_by",
    ]);
    const { title, description, due_date, is_completed, priority, updated_by } =
      data;
    const result = await db.query(
      `UPDATE tasks SET title=$1, description=$2, due_date=$3, is_completed=$4,
             priority=$5, updated_at=CURRENT_TIMESTAMP, updated_by=$6 WHERE id=$7 RETURNING *`,
      [title, description, due_date, is_completed, priority, updated_by, id]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Task update failed: ${err.message}`);
  }
};

Task.delete = async (id) => {
  try {
    if (!id) throw new Error("Task ID is required");
    await db.query("DELETE FROM tasks WHERE id = $1", [id]);
  } catch (err) {
    throw new Error(`Task deletion failed: ${err.message}`);
  }
};

module.exports = Task;
