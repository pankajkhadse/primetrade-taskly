
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {createUser,findByEmail} from '../models/auth.model.js'
// REGISTER
export const register = async (req, res) => {
    console.log(req.body)
    const { name, email, phone_no, password, role } = req.body

    try {
        // 1. check if email already exists
        const existingUser = await findByEmail(email)
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        // 2. hash the password — never store plain text
        const hashedPassword = await bcrypt.hash(password, 10)

        // 3. save user to DB
        const user = await createUser({
            name,
            email,
            phone_no,
            password: hashedPassword,
            role: role || 'client'
        })

        res.status(201).json({
            message: 'Registration successful',
            user_id: user.id
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // 1. check if user exists
        const user = await findByEmail(email)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // 2. compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        // 3. generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id:    user.id,
                name:  user.name,
                email: user.email,
                role:  user.role
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}