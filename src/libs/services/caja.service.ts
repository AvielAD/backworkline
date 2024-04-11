import { compradto } from '../dtos/caja.dto'
import { ServerResponseDTO } from '../dtos/serverresponse/serverresponse.dto'
import * as CtrlRepository from '../repositories/caja.repository'

export const AddCompraCaja = async (newcodigo: compradto)=>{

    const response = await CtrlRepository.AddCompraCaja(newcodigo)
    if(response)
    return {
        succeeded: true,
        message: "compra registrada correctamente"
    } as ServerResponseDTO
    else
    return {
        succeeded: false,
        message: "Se ha presentado un problema al registrar la compra"
    } as ServerResponseDTO
}