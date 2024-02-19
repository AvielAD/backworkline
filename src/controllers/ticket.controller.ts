import { Request, Response } from "express"
import * as CtrlService from '../libs/services/tickets.service'

export const GetTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await CtrlService.GetTickets()
        return res.status(200).json(tickets)
    } catch (error) {
        return res.status(404).json([])
    }
}

export const GetTicketById = async (req: Request, res: Response) => {
    const uuidSearch: string = String(req.params["uuidSearch"]) ?? ""
    try {
        

    } catch (error) {
        return res.status(404).json([])
    }
}

export const IniciarTicket = async (req: Request, res: Response) => {
    try {


    } catch (error) {
        return res.status(404).json([])
    }
}

export const CerrarTicket = async (req: Request, res: Response) => {
    try {


    } catch (error) {
        return res.status(404).json([])
    }
}

export const AddServiceToTicket = async (req: Request, res: Response) => {
    try {


    } catch (error) {
        return res.status(404).json([])
    }
}
