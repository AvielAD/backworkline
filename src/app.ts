import express, {Express} from 'express'
import cors from 'cors'
import tickets from '../src/routes/tickets.route'

const app: Express = express()

app.use(cors())
app.use(express.json())

app.use('/api', tickets)

export default app