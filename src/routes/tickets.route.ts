import { Router } from "express";
import * as CtrlTickets from '../controllers/ticket.controller'

const router = Router()

router.get('/tickets', CtrlTickets.GetTickets)
router.get('/tickets/:uuidSearch', CtrlTickets.GetTicketById)
router.post('/tickets', CtrlTickets.IniciarTicket)
router.put('/tickets/:uuidSearch', CtrlTickets.CerrarTicket)

export default router