import { Router } from "express";
import * as CtrlTickets from '../controllers/ticket.controller'

const router = Router()

router.get('/tickets', CtrlTickets.GetTickets)
router.get('/tickets/:uuidsearch', CtrlTickets.GetTickets)

export default router