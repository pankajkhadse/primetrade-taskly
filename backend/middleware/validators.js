import { body } from 'express-validator'

export const registerValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('phone_no')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('role')
        .optional()
        .isIn(['admin', 'client']).withMessage('Role must be admin or client'),
]

export const loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required'),
]

export const taskValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Task name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('task')
        .trim()
        .notEmpty().withMessage('Task description is required')
        .isLength({ min: 5, max: 255 }).withMessage('Description must be between 5 and 255 characters'),
]

export const updateTaskValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('task')
        .optional()
        .trim()
        .isLength({ min: 5, max: 255 }).withMessage('Description must be between 5 and 255 characters'),
]