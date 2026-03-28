import pool from '../config/db.js'

// Create task
export const createTask = async (data, owner_id) => {
    const { name, task } = data
    const [result] = await pool.query(
        `INSERT INTO task (owner_id, name, task) VALUES (?, ?, ?)`,
        [owner_id, name, task]
    )
    return { id: result.insertId }
}


// Get all tasks - filtered by owner (for clients)
export const getAllTasks = async (owner_id, role) => {
    if (role === 'admin') {
        const [rows] = await pool.query(
            `SELECT task.*, users.name AS owner_name 
             FROM task 
             JOIN users ON task.owner_id = users.id`
        )
        return rows
    } else {
        const [rows] = await pool.query(
            `SELECT task.*, users.name AS owner_name 
             FROM task 
             JOIN users ON task.owner_id = users.id
             WHERE task.owner_id = ?`,
            [owner_id]
        )
        return rows
    }
}

// Get single task by id
export const getTaskById = async (id) => {
    const [rows] = await pool.query(
        `SELECT task.*, users.name AS owner_name 
         FROM task 
         JOIN users ON task.owner_id = users.id
         WHERE task.id = ?`,
        [id]
    )
    return rows[0]
}

// Update task
// Update task
export const updateTask = async (id, { name, task }) => {
    const [result] = await pool.query(
        `UPDATE task 
         SET name = COALESCE(?, name), task = COALESCE(?, task)
         WHERE id = ?`,
        [name ?? null, task ?? null, id]
    )
    return result.affectedRows
}

// Delete task
export const deleteTask = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM task WHERE id = ?`,
        [id]
    )
    return result.affectedRows
}