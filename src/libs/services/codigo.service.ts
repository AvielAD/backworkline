import { codigodescuentodto } from '../dtos/codigo.dto'
import { ServerResponseDTO } from '../dtos/serverresponse/serverresponse.dto'
import * as CtrlRepository from '../repositories/codigos.repository'

export const GetCodigos = ()=>{
    return CtrlRepository.GetCodigos()
}

export const AddCodigoNormal = async (newcodigo: codigodescuentodto)=>{

    const response = await CtrlRepository.AddCodigoNormal(newcodigo)
    if(response)
    return {
        succeeded: true,
        message: "codigo de descuento agregado correctamente"
    } as ServerResponseDTO
    else
    return {
        succeeded: false,
        message: "Se ha presentado un problema al generar el codigo de descuento"
    } as ServerResponseDTO
}

export const AddCodigoDayPass = async (newcodigo: codigodescuentodto)=>{

    const response = await CtrlRepository.AddCodigoDayPass(newcodigo)
    if(response)
    return {
        succeeded: true,
        message: "codigo de descuento agregado correctamente"
    } as ServerResponseDTO
    else
    return {
        succeeded: false,
        message: "Se ha presentado un problema al generar el codigo de descuento"
    } as ServerResponseDTO
}