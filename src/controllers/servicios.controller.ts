import { Request, Response } from "express"
import * as CtrlService from '../libs/services/servicios.service'
import { catserviciodto } from "../libs/dtos/servicio.dto"

export const GetServicios = async (req: Request, res: Response) => {
    try {
        const tickets = await CtrlService.GetServicios()
        return res.status(200).json(tickets)
    } catch (error) {
        return res.status(404).json([])
    }
}

export const AddServicio = async (req: Request, res: Response) => {
    try {
        const newServicio: catserviciodto = req.body

        const tickets = await CtrlService.AddServicio(newServicio)
        return res.status(200).json(tickets)
    } catch (error) {
        return res.status(404).json([])
    }
}