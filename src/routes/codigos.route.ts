import { Router } from "express";
import * as CtrlTickets from '../controllers/codigos.controller'
import * as Auth from '../libs/middleware/auth/authcheck.middleware'
const router = Router()

router.get('/codigos',[Auth.VerifyToken], CtrlTickets.GetCodigos)
router.post('/codigos/normal',[Auth.VerifyToken], CtrlTickets.AddcodigoNormal)
router.post('/codigos/daypass',[Auth.VerifyToken], CtrlTickets.AddcodigoDayPass)

export default router