const db = require("../database/db");

const Users = {};

Users.createUser = async (email, name, createdBy) => {
  const query = `INSERT INTO users (email, name, created_by) VALUES ($1, $2, $3) RETURNING *`;
  const data = [email, name, createdBy];
  try {
    const res = await db.query(query, data);
    return res.rows[0];
  } catch (err) {
    console.error("Error creating user: ", err);
    throw new Error("Error creating user: " + err.message);
  }
};

Users.getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const data = [id];
  try {
    const res = await db.query(query, data);
    return res.rows[0];
  } catch (err) {
    console.error("Error fetching user: ", err);
    throw new Error("Error fetching user: " + err.message);
  }
};

Users.getAllUsers = async () => {
  const query = `SELECT * FROM users`;
  try {
    const res = await db.query(query);
    return res.rows;
  } catch (err) {
    console.error("Error fetching users: ", err);
    throw new Error("Error fetching users: " + err.message);
  }
};

Users.updateUser = async (id, data) => {
  const { name, email, updatedBy } = data;
  const query = `UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP, updated_by = $3 WHERE id = $4 RETURNING *`;
  const values = [name, email, updatedBy, id];
  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error("Error updating user: ", err);
    throw new Error("Error updating user: " + err.message);
  }
};

Users.deleteUser = async (id) => {
  const query = `UPDATE users SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
  const data = [id, "active"];
  try {
    const res = await db.query(query, data);
    return res.rows[0];
  } catch (err) {
    console.error("Error deleting user: ", err);
    throw new Error("Error deleting user: " + err.message);
  }
};

module.exports = Users;
