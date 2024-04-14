import { PrismaClient } from "@prisma/client"
import { DateTime } from "luxon"

const prisma = new PrismaClient()


export const CalcularCostoServicios = async (idticket: number)=>{
    try {
        //buscar ticket
        var ticket = await prisma.ticket.findFirst({
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