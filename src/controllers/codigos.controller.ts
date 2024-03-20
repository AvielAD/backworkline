import { Request, Response } from "express"
import { codigodescuentodto } from "../libs/dtos/codigo.dto"
import * as CtrlService from '../libs/services/codigo.service'

export const GetCodigos = async (req: Request, res: Response) => {
    try {
        const tickets = await CtrlService.GetCodigos()
        return res.status(200).json(tickets)
    } catch (error) {
        return res.status(404).json([])
    }
}

export const AddcodigoNormal = async (req: Request, res: Response) => {
    const newTicket: codigodescuentodto = req.body

    try {

        const response = await CtrlService.AddCodigoNormal(newTicket)
        if(response.succeeded)
            return res.status(200).json(response)
        else
            return res.status(404).json(response)

    } catch (error) {
        return res.status(404).json([])
    }
}

export const AddcodigoDayPass = async (req: Request, res: Response) => {
    const newTicket: codigodescuentodto = req.body

    try {

        const response = await CtrlService.AddCodigoDayPass(newTicket)
        if(response.succeeded)
            return res.status(200).json(response)
        else
            return res.status(404).json(response)

    } catch (error) {
        return res.status(404).json([])
    }
}