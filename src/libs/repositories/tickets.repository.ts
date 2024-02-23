import { PrismaClient } from "@prisma/client"
import { ServicioDto, cat_ticketDto, createTicketDto, ticketsDto } from "../dtos/tickets.dto"
import moment from "moment-timezone"

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
                fechainicio: moment.tz(item.fechainicio, "America/Mexico_City").format("YYYY-MM-DD HH:mm:ss"),
                nombre: item.nombre,
                uuid: item.uuidsearch,
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
    let serviceList = [] as Array<ServicioDto>
    try {
        const categories = await prisma.cat_ticket.findMany()
        const services = await prisma.cat_servicios.findMany()

        const ticket = await prisma.ticket.findFirst({
            where:{
                uuidsearch: uuidSearch
            },
            include: {
                servicio_ticket: true
            }
        })
        
        ticket?.servicio_ticket.forEach((item)=>{
            serviceList.push({
                id: item.idcatservicio,
                nombre: services.find(y=> y.id == item.idcatservicio)?.nombre,
                costo: parseFloat(services.find(y=> y.id == item.idcatservicio)?.costo?.toString() ?? "0"),
                includepay: item.includepay
            } as ServicioDto)
        })
        const dateiniciostring = moment.tz(ticket?.fechainicio, "America/Mexico_City").format("YYYY-MM-DD HH:mm:ss")
        const datefinstring = moment.tz(ticket?.fechafinal, "America/Mexico_City").format("YYYY-MM-DD HH:mm:ss")
        
        let ticketresponse = {
            id : ticket?.id,
            fechainicio : dateiniciostring,
            fechafinal: datefinstring,
            nombre: ticket?.nombre,
            uuid: uuidSearch,
            total: parseFloat( ticket?.total?.toString() ?? "0") ,
            category: {
                id: ticket?.idcatticket,
                nombre: categories.find(y=> y.id == ticket?.idcatticket)?.nombre
            } as cat_ticketDto,
            servicios: serviceList
        } as ticketsDto


        return ticketresponse
    } catch (error) {
        return null
    }
}

export const IniciarTicker = async(newTicket: createTicketDto)=>{
    try {
        const newElement = await prisma.ticket.create({
            data:{
                idcatticket: newTicket.idcatticket,
                nombre: newTicket.nombre
            }
        })
        return true
    } catch (error) {
        return false
    }
}
export const CerrarTicket = async (uuid:string) =>{
    let costotiempo:number = 0
    let costoservicios:number = 0
    let minutosTotales 
    let serviceList = [] as Array<ServicioDto>

    try {
        const services = await prisma.cat_servicios.findMany()

        const ticket = await prisma.ticket.findFirst({
            where:{
                uuidsearch: uuid
            },
            include:{
                cat_ticket: true,
                servicio_ticket: true
            }
        })

        ticket?.servicio_ticket.forEach((item)=>{
            serviceList.push({
                id: item.idcatservicio,
                nombre: services.find(y=> y.id == item.idcatservicio)?.nombre,
                costo: parseFloat(services.find(y=> y.id == item.idcatservicio)?.costo?.toString() ?? "0"),
                includepay: item.includepay
            } as ServicioDto)
        })


        const fechaCierre = moment().toDate()
        //calcular costo tiempo
        if(ticket?.fechainicio !=null){
            minutosTotales = totalCostTime(ticket.fechainicio, fechaCierre, parseFloat( ticket.cat_ticket?.costohora?.toString() ?? "0"))
            costotiempo = minutosTotales.total
            if(serviceList.length>0){
                costoservicios= totalCostServices(serviceList)
            }
        }
        //calcular costo servicios
        
        const cerrar = await prisma.ticket.update({
            where:{
                id:parseInt(ticket?.id.toString() ?? "0")
            },
            data:{
                fechafinal: fechaCierre,
                total: costotiempo + costoservicios
            }
            
        })
        
        return minutosTotales
    } catch (error) {
        return null
    }
}


const totalCostServices = (services: Array<ServicioDto>)=>{
    let totalresponse:number = 0
    services.forEach((item:ServicioDto)=>{

        if(item.includepay){
            totalresponse+=item.costo
        }
    })
    return totalresponse
}

const totalCostTime = (inicio: Date, fin: Date, costohora: number)=>{
    let totalresponse:number = 0
    let valuesCalc = {
        total: 0,
        minutos: 0
    }
    const start = moment(inicio)
    const end = moment(fin)
    const tiempototalm = moment.duration(end.diff(start))
    const minutos = tiempototalm.asMinutes()
    

    if(minutos < 10)
        totalresponse= 0
    else if(minutos > 240)
        totalresponse = costohora * 4
    else if(minutos >= 10 && minutos <= 60)
        totalresponse = costohora
    else if(minutos > 60 && minutos <= 240)
        totalresponse = costohora + ((costohora/minutos) * (minutos-60))  

        valuesCalc.minutos= minutos
        valuesCalc.total= parseFloat((Math.round( totalresponse * 100) / 100).toFixed(0))

    return valuesCalc
}

