import { PrismaClient } from "@prisma/client"
import { DateTime } from "luxon"

const prisma = new PrismaClient()


export const CalcularCostoServicios = async (idticket: number)=>{
    try {
        //buscar ticket
        var ticket = await prisma.ticket.findFirstOrThrow({
            where:{
                id: idticket
            }
        })
        //buscar servicios
        var serviciosticket = await prisma.servicio_ticket.findMany({
            where:{
                idticket: idticket
            },
            include:{
                cat_servicios: true
            }
        })
        //calcular

        let costoServicios = 0.0
        serviciosticket.forEach(item=>{
            costoServicios+= parseFloat( item.cat_servicios.costo?.toString() ?? "0")
        })

        const responseticket = await prisma.ticket.update({
            where: {
                id: idticket
            },
            data:{
                totalcostoservicios: costoServicios
            }
        })
        return true
    } catch (error) {
        return false
    }


}

export const CalcularTotal = async (idticket:number)=>{
    try {
        
        const ticket = await prisma.ticket.findFirstOrThrow({
            where:{
                id: idticket
            }
        })

        const costoTiempo = parseFloat(ticket.totalcostotiempo?.toString() ?? "0")
        const costoServicios = parseFloat(ticket.totalcostoservicios?.toString() ?? "0")
        const costoDescuento = parseFloat(ticket.totaldescuento?.toString() ?? "0")

        const updateTicket = await prisma.ticket.update({
            where:{
                id: idticket
            },
            data:{
                total: (costoTiempo+costoServicios - costoDescuento)
            }
        })

        return true
    } catch (error) {
        return false
    }
}