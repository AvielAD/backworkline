import { PrismaClient } from "@prisma/client"
import { codigodescuentodto } from "../dtos/codigo.dto"

const prisma = new PrismaClient()

export const GetCodigos = async()=>{
    try {
        const codigos = await prisma.codigodescuento.findMany()

        return codigos
    } catch (error) {
        return []
    }
}
/**
 * Reglas
 * 
 * 1.- Multiples usos por codigo
 * 2.- categoria Normal
 * 3.- EL descuento aplica sobre costo final (tiempo + consumo) - codigodescuento
 * @param addcodigo 
 * @returns 
 */
export const AddCodigoNormal = async (addcodigo: codigodescuentodto)=>{
    try {
        const newcodigo = await prisma.codigodescuento.create({
            data:{
                nombre: addcodigo.nombre,
                descripcion: addcodigo.descripcion,
                fechavigencia: addcodigo.fechavigencia,
                replicas: addcodigo.replicas,
                idcatcodigo: 1,
                descuento: addcodigo.descuento
            }
        })
        return true
    } catch (error) {
        return false
    }
}
/**
 * Reglas
 * 1.- Solo una instancia por codigo
 * 2.- Categoria DayPass
 * 3.- el descuento aplica a toda la cuenta resultando en 0 (tiempo + consumo ) = 0
 * 
 * @param addcodigo 
 * @returns 
 */
export const AddCodigoDayPass = async (addcodigo: codigodescuentodto)=>{
    try {
        const newcodigo = await prisma.codigodescuento.create({
            data:{
                nombre: addcodigo.nombre,
                descripcion: addcodigo.descripcion,
                fechavigencia: addcodigo.fechavigencia,
                replicas: 1,
                idcatcodigo: 2,
                descuento: 100
            }
        })
        return true
    } catch (error) {
        return false
    }
}