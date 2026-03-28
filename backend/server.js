import express from 'express'
import authrouter from './routes/auth.route.js'
import taskrouter from './routes/task.route.js'
import checkLogin from './middleware/checkLogin.js'
import cors from 'cors';

const app = express()
const port = 8081

// Option A: Allow only your frontend (Recommended for security)
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/auth', authrouter)
app.use('/v1/task', checkLogin, taskrouter)
app.use(cors({ origin: 'http://localhost:3000' })); // Use your client's origin



app.listen(port, (req, res) => {
    `app running on the ${port} port `
})