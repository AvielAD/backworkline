import express, {Express} from 'express'
import cors from 'cors'
import tickets from '../src/routes/tickets.route'
import codigos from '../src/routes/codigos.route'
import servicios from '../src/routes/servicios.route'

const app: Express = express()

app.use(cors())
app.use(express.json())

app.use('/api', tickets)
app.use('/api', codigos)
app.use('/api', servicios)

export default app