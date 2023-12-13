import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
}

const app = express()
const port = 3030

// App configuration
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// Routes
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)

// start the server on port 3030

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    loggerService.info('Up and running on port 3030')
})
