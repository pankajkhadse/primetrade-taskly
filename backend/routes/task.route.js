import express from 'express'

import { restrictTo } from '../middleware/restrictTo.js'
import { listTasks, editTask, removeTask,Task } from '../controllers/task.controller.js'
import { validate } from '../middleware/validate.js'
import { taskValidator, updateTaskValidator } from '../middleware/validators.js'

const router = express.Router()

router.post('/',restrictTo('admin'),taskValidator, validate,Task)
router.get('/',listTasks)
router.delete('/:id',removeTask)
router.put('/:id',updateTaskValidator, validate,editTask)



 export default router