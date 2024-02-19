
import { ServerResponseDTO } from '../dtos/serverresponse/serverresponse.dto'
import { createTicketDto } from '../dtos/tickets.dto'
import * as CtrlRepository from '../repositories/tickets.repository'

export const GetTickets = async ()=>{
    let tickets = await CtrlRepository.GetTickets()
    return tickets
}

export const GetTicketByUUID = async(uuidSearch: string)=>{

    let ticket = await CtrlRepository.GetTicketByUUID(uuidSearch)

    return ticket
}

export const IniciarTicket = async ( newTicket: createTicketDto)=>{
    const response = await CtrlRepository.IniciarTicker(newTicket)
    if(response){
        return {
            succeeded: true,
            message: "Ticket Iniciado Correctamente"
        } as ServerResponseDTO
    }
    else{
        return {
            succeeded: false,
            message: "Se ha presentado un problema al iniciar el ticket"
        } as ServerResponseDTO
    }
}

export const CerrarTicket = async(uuidSearch: string)=>{
    const response = await CtrlRepository.CerrarTicket(uuidSearch)
    if(response){
        return {
            succeeded: true,
            message: "Ticket Cerrado Correctamente"
        } as ServerResponseDTO
    }
    else{
        return {
            succeeded: false,
            message: "Se ha presentado un problema al cerrar el ticket"
        } as ServerResponseDTO
    }
}