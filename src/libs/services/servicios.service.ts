
import { ServerResponseDTO } from '../dtos/serverresponse/serverresponse.dto'
import { catserviciodto } from '../dtos/servicio.dto'
import * as CtrlRepository from '../repositories/servicios.repository'

export const GetServicios = async ()=>{
    let servicios = await CtrlRepository.GetServicios()
    return servicios
}

export const AddServicio = async (newServicio: catserviciodto)=>{
    let servicioresponse = await CtrlRepository.AddServicio(newServicio)

    if(servicioresponse){
        return {
            succeeded: true,
            message: "Servicio agregado correctamente"
        } as ServerResponseDTO
    }
    else{
        return {
            succeeded: false,
            message: "Se ha presentado un problema al agregar el servicio"
        } as ServerResponseDTO
    }
}