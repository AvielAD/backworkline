import { Request, Response } from "express"
import * as CtrlService from '../libs/services/tickets.service'
import { createTicketDto } from "../libs/dtos/tickets.dto"

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
        const ticket = await CtrlService.GetTicketByUUID(uuidSearch)
        return res.status(200).json(ticket)
    } catch (error) {
        return res.status(404).json([])
    }
}

export const IniciarTicket = async (req: Request, res: Response) => {
    const newTicket: createTicketDto = req.body

    try {

        const response = await CtrlService.IniciarTicket(newTicket)
        if(response.succeeded)
            return res.status(200).json(response)
        else
            return res.status(404).json(response)

    } catch (error) {
        return res.status(404).json([])
    }
}

export const CerrarTicket = async (req: Request, res: Response) => {
    const uuid: string = String(req.params["uuidSearch"]) ?? ""

    try {
        const response = await CtrlService.CerrarTicket(uuid)
        if(response.succeeded)
            return res.status(200).json(response)
        else
            return res.status(404).json(response)

    } catch (error) {
        return res.status(404).json([])
    }
}

export const AddServiceToTicket = async (req: Request, res: Response) => {
    const uuidSearch: string = String(req.params["uuidSearch"]) ?? ""
    try {


    } catch (error) {
        return res.status(404).json([])
    }
}
