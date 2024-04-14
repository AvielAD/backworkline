import { PrismaClient } from "@prisma/client"
import { servicioinputfulldto } from "../dtos/tickets.dto"
import { compradto } from "../dtos/caja.dto"
import { DateTime } from "luxon"
import * as CtrlCostos from './costos.repository'
const prisma = new PrismaClient()


export const AddCompraCaja = async(newServicio: compradto)=>{
    try {
        //agregar ticket
        const newTicket = await prisma.ticket.create({
            data:{
                nombre: "Venta General",
                idcatticket: 3,//Compra,
                idestado: 3,//finalizado,
                fechafinal: DateTime.now().toString()
            }
        })
        //agregar servicios a ticket

        let newServicios = [] as Array<servicioinputfulldto>

        newServicio.servicios.forEach(element => {
            newServicios = [...newServicios, {idticket: newTicket.id, idcatservicio: element, includepay:false}]
        });

        const response = await prisma.servicio_ticket.createMany({
            data: newServicios
        })

        //efectuar calculo para los servicios asignados al nuevo ticket
        await CtrlCostos.CalcularCostoServicios(newTicket.id)
        await CtrlCostos.CalcularTotal(newTicket.id)

        return true
    } catch (error) {
        return false
    }
}