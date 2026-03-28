import express from 'express'
import {register,login} from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { registerValidator, loginValidator } from '../middleware/validators.js'

const router = express.Router()

router.post('/register', registerValidator,validate, register)
router.post('/login',loginValidator,validate,login)


 export default router