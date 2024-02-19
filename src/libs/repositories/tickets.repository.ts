import { PrismaClient } from "@prisma/client"
import { cat_ticketDto, ticketsDto } from "../dtos/tickets.dto"

const prisma = new PrismaClient()

export const GetTickets = async () => {
    let tickets = [] as Array<ticketsDto>
    
    try {
        //agregar ticket
        const categories = await prisma.cat_ticket.findMany()

        const ticketsresponse = await prisma.ticket.findMany({
            include: {
                cat_ticket: true,
            }
        })
        //calcular total consumido en servicios

        ticketsresponse.forEach((item, index) => {
            tickets.push({
                id: item.id,
                fechainicio: item.fechainicio,
                fechafinal: item.fechafinal,
                nombre: item.nombre,
                category: {
                    id: item.cat_ticket?.id,
                    nombre: item.cat_ticket?.nombre
                } as cat_ticketDto,
            } as ticketsDto)

        })
        //agregar servicios
        return tickets
    } catch (error) {
        console.log(error)
        return []
    }
}

export const GetTicketByUUID = async(uuidSearch: string)=>{
    
    try {
        
    } catch (error) {
        
    }
}
