import { Router } from "express";
import * as CtrlCaja from '../controllers/caja.controller'
import * as Auth from '../libs/middleware/auth/authcheck.middleware'
const router = Router()

router.post('/caja',[Auth.VerifyToken], CtrlCaja.AddCompraCaja)

export default router