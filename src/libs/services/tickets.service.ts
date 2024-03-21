
import { ServerResponseDTO, ServerResponseDataDto } from '../dtos/serverresponse/serverresponse.dto'
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

export const UpdateTicket = async(uuidSearch: string)=>{

    if(! await CtrlRepository.CheckEstadoTicket(uuidSearch)){

        return {
            succeeded: false,
            message: "El ticket ya no esta siendo monitoreado",
        } as ServerResponseDataDto

    }

    const response = await CtrlRepository.UpdateTicket(uuidSearch)

    if(response !=null){
        return {
            succeeded: true,
            message: "Ticket Actualizado Correctamente",
            data:response
        } as ServerResponseDataDto
    }
    else{
        return {
            succeeded: false,
            message: "Se ha presentado un problema al actualizar el ticket",
            data: null
        } as ServerResponseDataDto
    }
}

export const CerrarTicket = async(uuidSearch: string)=>{

    if(! await CtrlRepository.CheckEstadoTicket(uuidSearch)){

        return {
            succeeded: false,
            message: "El ticket ya no esta siendo monitoreado",
        } as ServerResponseDataDto

    }

    const response = await CtrlRepository.CerrarTicket(uuidSearch)

    if(response !=null){
        return {
            succeeded: true,
            message: "Ticket Cerrado Correctamente",
            data:response
        } as ServerResponseDataDto
    }
    else{
        return {
            succeeded: false,
            message: "Se ha presentado un problema al cerrar el ticket",
            data: null
        } as ServerResponseDataDto
    }
}

export const ApplicarDescuento = async (idticket:number, uuidkey:string)=>{

    //verificar si el codigo aun es valido por fecha

    //verificar si el codigo aun es valido por instancias

    //verificar si el codigo aun es valido al aun no ser aplicado (daypass)

    const response = await CtrlRepository.AssignarDescuento(idticket,uuidkey)

    if(response !=null){
        return {
            succeeded: true,
            message: "Codigo descuento aplicado correctamente",
            data:response
        } as ServerResponseDataDto
    }
    else{
        return {
            succeeded: false,
            message: "Se presento un problema al aplicar el codigo de descuento",
            data: null
        } as ServerResponseDataDto
    }
}