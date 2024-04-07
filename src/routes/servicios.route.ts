import { Router } from "express";
import * as CtrlTickets from '../controllers/servicios.controller'
import * as Auth from '../libs/middleware/auth/authcheck.middleware'
const router = Router()

router.get('/servicios',[Auth.VerifyToken], CtrlTickets.GetServicios)
router.post('/servicios',[Auth.VerifyToken], CtrlTickets.AddServicio)

export default router