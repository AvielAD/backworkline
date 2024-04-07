import { PrismaClient } from "@prisma/client"
import { ServicioDto } from "../dtos/tickets.dto"
import { catserviciodto } from "../dtos/servicio.dto"

const prisma = new PrismaClient()

export const GetServicios = async()=>{
    try {
        const codigos = await prisma.cat_servicios.findMany()

        return codigos
    } catch (error) {
        return []
    }
}

export const AddServicio = async(newServicio: catserviciodto)=>{
    try {
        const codigos = await prisma.cat_servicios.create({
            data:{
                nombre: newServicio.nombre,
                costo: newServicio.costo
            }
        })

        return true
    } catch (error) {
        return false
    }
}