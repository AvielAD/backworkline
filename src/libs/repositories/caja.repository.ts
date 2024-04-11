import { PrismaClient } from "@prisma/client"
import { servicioinputfulldto } from "../dtos/tickets.dto"
import { compradto } from "../dtos/caja.dto"
import { DateTime } from "luxon"

const prisma = new PrismaClient()


export const AddCompraCaja = async(newServicio: compradto)=>{
    try {
        //agregar ticket
        const newTicket = await prisma.ticket.create({
            data:{
                nombre: DateTime.now().toLocaleString(DateTime.TIME_SIMPLE),
                idcatticket: 3,//Compra,
                idestado: 3,//finalizado,
                fechafinal: DateTime.now().toString()
            }
        })
        //agregar servicios a ticket

        let newServicios = [] as Array<servicioinputfulldto>

        newServicio.servicios.forEach(element => {
            newServicios = [...newServicios, {idticket: newTicket.id, idcatservicio: element}]
        });

        const response = await prisma.servicio_ticket.createMany({
            data: newServicios
        })

        //efectuar calculo para los servicios asignados al nuevo ticket

        return true
    } catch (error) {
        return false
    }
}