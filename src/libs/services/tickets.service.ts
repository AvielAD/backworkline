
import * as CtrlRepository from '../repositories/tickets.repository'

export const GetTickets = async ()=>{
    let tickets = await CtrlRepository.GetTickets()
    return tickets
}