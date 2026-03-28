import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../models/task.model.js'

// CREATE Task
export const Task = async (req, res) => {
    try {
        const data = req.body
        const owner_id = req.user.id
        const result = await createTask(data, owner_id)

        res.status(201).json({
            message: "Task created successfully",
            taskId: result.id
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// LIST all Tasks
export const listTasks = async (req, res) => {
    try {
        const { id: owner_id, role } = req.user
        const tasks = await getAllTasks(owner_id, role)
        res.status(200).json({
            message: 'Tasks fetched successfully',
            count: tasks.length,
            tasks
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// GET single Task
export const getTask = async (req, res) => {
    const { id } = req.params

    try {
        const task = await getTaskById(id)
        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        // only owner or admin can view
        if (task.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not own this Task' })
        }

        res.status(200).json({ message: 'Task fetched successfully', task })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// UPDATE Task
export const editTask = async (req, res) => {
    const { id } = req.params
    const { name, task } = req.body

    try {
        const existingTask = await getTaskById(id)
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (existingTask.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not own this Task' })
        }

        await updateTask(id, { name, task })
        res.status(200).json({ message: 'Task updated successfully' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// DELETE Task
export const removeTask = async (req, res) => {
    const { id } = req.params

    try {
        const task = await getTaskById(id)
        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (task.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not own this Task' })
        }

        await deleteTask(id)
        res.status(200).json({ message: 'Task deleted successfully' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}