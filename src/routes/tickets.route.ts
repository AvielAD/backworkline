import { Router } from "express";
import * as CtrlTickets from '../controllers/ticket.controller'
import * as Auth from '../libs/middleware/auth/authcheck.middleware'
const router = Router()

router.get('/tickets',[Auth.VerifyToken], CtrlTickets.GetTickets)
router.get('/tickets/:uuidSearch',[Auth.VerifyToken], CtrlTickets.GetTicketById)
router.post('/tickets', [Auth.VerifyToken], CtrlTickets.IniciarTicket)
router.put('/tickets/:uuidSearch', [Auth.VerifyToken], CtrlTickets.UpdateTicket)
router.post('/tickets/:uuidSearch', [Auth.VerifyToken], CtrlTickets.CerrarTicket)

export default router