import pool from '../config/db.js'

// create a new user — used during register
export const createUser = async ({ name, email, phone_no, password, role }) => {
    const [result] = await pool.query(
        `INSERT INTO users (name, email, phone_no, password, role)
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone_no, password, role]
    )
    return { id: result.insertId }
}

// find a user by email — used during login
export const findByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    )
    return rows[0]  // returns user object or undefined
}

export const getprofile = async (id) =>{
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE id = ?`,
        [id]
    )
    return rows[0] 
}

export const updateProfile = async (id, finalData) => {
    
  
    // 3. Destructure the merged result for your SQL query
    const { name, email, phone_no } = finalData;

    await pool.query(
        `UPDATE users SET name = ?, email = ?, phone_no = ? WHERE id = ?`,
        [name, email, phone_no, id]
    );


};