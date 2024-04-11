import { Request, Response } from "express"
import * as CtrlService from '../libs/services/caja.service'
import { compradto } from "../libs/dtos/caja.dto"


export const AddCompraCaja = async (req: Request, res: Response) => {
    try {
        const newServicio: compradto = req.body

        const tickets = await CtrlService.AddCompraCaja(newServicio)
        return res.status(200).json(tickets)
    } catch (error) {
        return res.status(404).json([])
    }
}