import { PrismaClient } from "@prisma/client"
import { ServicioDto, cat_ticketDto, createTicketDto, ticketsDto } from "../dtos/tickets.dto"
import moment from "moment-timezone"
import { CatEstadoTicket } from "../enums/tickets.enum"
import { DateTime } from 'luxon'
const prisma = new PrismaClient()

const isEqualDateNow = (fechaInicio: Date | null) =>{
    const FechaInicio = fechaInicio?.toISOString() ?? DateTime.now().toString()
    let fechaComparar = DateTime.fromISO(FechaInicio)
    let fechaHoy = DateTime.now()
    return fechaComparar.toLocaleString(DateTime.DATE_SHORT) == fechaHoy.toLocaleString(DateTime.DATE_SHORT)
}

export const GetTickets = async () => {
    let tickets = [] as Array<ticketsDto>

    try {
        //agregar ticket
        const ticketview = await prisma.ticket.findMany({
            include: {
                cat_estadoticket: true,
                cat_ticket: true
            }
        })

        //calcular total consumido en servicios

        let ticketsall = ticketview.filter(x => isEqualDateNow(x.fechainicio))
        
        ticketsall.forEach((item, index) => {

            tickets.push({
                id: item.id,
                fechainicio: item.fechainicio?.toString(),
                nombre: item.nombre,
                uuid: item.uuidsearch,
                estado: item.cat_estadoticket?.nombre,
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


export const GetTicketByUUID = async (uuidSearch: string) => {
    let serviceList = [] as Array<ServicioDto>
    try {
        const categories = await prisma.cat_ticket.findMany()
        const estados = await prisma.cat_estadoticket.findMany()
        const services = await prisma.cat_servicios.findMany()

        const ticket = await prisma.ticket.findFirst({
            where: {
                uuidsearch: uuidSearch
            },
            include: {
                servicio_ticket: true
            }
        })

        ticket?.servicio_ticket.forEach((item) => {
            serviceList.push({
                id: item.idcatservicio,
                nombre: services.find(y => y.id == item.idcatservicio)?.nombre,
                costo: parseFloat(services.find(y => y.id == item.idcatservicio)?.costo?.toString() ?? "0"),
                includepay: item.includepay
            } as ServicioDto)
        })
        const dateiniciostring = moment.tz(ticket?.fechainicio, "America/Mexico_City").format("YYYY-MM-DD HH:mm:ss")
        const datefinstring = moment.tz(ticket?.fechafinal, "America/Mexico_City").format("YYYY-MM-DD HH:mm:ss")

        let ticketresponse = {
            id: ticket?.id,
            fechainicio: dateiniciostring,
            fechafinal: datefinstring,
            nombre: ticket?.nombre,
            uuid: uuidSearch,
            total: parseFloat(ticket?.total?.toString() ?? "0"),
            estado: estados.find(x => x.id == ticket?.idestado)?.nombre,
            category: {
                id: ticket?.idcatticket,
                nombre: categories.find(y => y.id == ticket?.idcatticket)?.nombre
            } as cat_ticketDto,
            servicios: serviceList
        } as ticketsDto


        return ticketresponse
    } catch (error) {
        return null
    }
}

export const IniciarTicker = async (newTicket: createTicketDto) => {
    try {
        const newElement = await prisma.ticket.create({
            data: {
                idcatticket: newTicket.idcatticket,
                nombre: newTicket.nombre
            }
        })
        return true
    } catch (error) {
        return false
    }
}
export const UpdateTicket = async (uuid: string) => {
    let costotiempo: number = 0
    let costoservicios: number = 0
    let minutosTotales
    let serviceList = [] as Array<ServicioDto>

    try {
        const services = await prisma.cat_servicios.findMany()

        const ticket = await prisma.ticket.findFirst({
            where: {
                uuidsearch: uuid,
            },
            include: {
                cat_ticket: true,
                servicio_ticket: true
            }
        })


        ticket?.servicio_ticket.forEach((item) => {
            serviceList.push({
                id: item.idcatservicio,
                nombre: services.find(y => y.id == item.idcatservicio)?.nombre,
                costo: parseFloat(services.find(y => y.id == item.idcatservicio)?.costo?.toString() ?? "0"),
                includepay: item.includepay
            } as ServicioDto)
        })
        const fechaCierre = moment().toDate()
        //calcular costo tiempo
        if (ticket?.fechainicio != null) {
            minutosTotales = totalCostTime(ticket.fechainicio, fechaCierre, parseFloat(ticket.cat_ticket?.costohora?.toString() ?? "0"))
            costotiempo = minutosTotales.total
            if (serviceList.length > 0) {
                costoservicios = totalCostServices(serviceList)
            }
        }
        const cerrar = await prisma.ticket.update({
            where: {
                id: parseInt(ticket?.id.toString() ?? "0")
            },
            data: {
                fechafinal: fechaCierre,
                total: costotiempo + costoservicios
            }

        })

        return minutosTotales
    } catch (error) {
        return null
    }
}

export const CerrarTicket = async (uuidSerach: string) => {
    try {
        //buscar ticket
        const ticketsearch = await prisma.ticket.findFirst({
            where: {
                uuidsearch: uuidSerach
            }
        })
        //obtener unformacion tiempo total
        const dateinicio = DateTime.fromISO(ticketsearch?.fechainicio?.toISOString() ?? "")
        const datefinal = DateTime.fromISO(ticketsearch?.fechafinal?.toISOString() ?? "")
        //calcular tiempo total para establecer el estado
        //10 minutos o menos, ticket cancelado
        const diftime = datefinal.diff(dateinicio, ["minutes"])
        //mas de 10 minutos ticket finalizado
        let nuevoEstado = 1
        if (diftime.minutes <= 10)
            nuevoEstado = 2
        if (diftime.minutes > 10)
            nuevoEstado = 3
        const updateTicket = await prisma.ticket.update({
            where: {
                id: ticketsearch?.id
            },
            data: {
                idestado: nuevoEstado
            }
        })
        //aplicar descuento a ticket desde codigo agregado
        if (ticketsearch?.id)
            await ApplicarDescuento(ticketsearch.id)

        return true
    } catch (error) {

        console.log(error)
        return false
    }

}


export const CheckEstadoTicket = async (uuidSearch: string) => {
    try {

        const ticketcheck = await prisma.ticket.findFirst({
            where: {
                uuidsearch: uuidSearch
            }
        })

        if (ticketcheck?.idestado == CatEstadoTicket.Iniciado)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const totalCostServices = (services: Array<ServicioDto>) => {
    let totalresponse: number = 0
    services.forEach((item: ServicioDto) => {

        if (item.includepay) {
            totalresponse += item.costo
        }
    })
    return totalresponse
}

const totalCostTime = (inicio: Date, fin: Date, costohora: number) => {
    let totalresponse: number = 0
    let valuesCalc = {
        total: 0,
        minutos: 0
    }
    const start = moment(inicio)
    const end = moment(fin)
    const tiempototalm = moment.duration(end.diff(start))
    const minutos = tiempototalm.asMinutes()


    if (minutos < 10)
        totalresponse = 0
    else if (minutos > 240)
        totalresponse = costohora * 4
    else if (minutos >= 10 && minutos <= 60)
        totalresponse = costohora
    else if (minutos > 60 && minutos <= 240)
        totalresponse = costohora + ((costohora / minutos) * (minutos - 60))

    valuesCalc.minutos = minutos
    valuesCalc.total = parseFloat((Math.round(totalresponse * 100) / 100).toFixed(0))

    return valuesCalc
}
const ApplicarDescuento = async (idticket: number) => {
    try {
        const ticket = await prisma.ticket.findFirstOrThrow({
            where: {
                id: idticket
            }
        })

        if (ticket != null) {
            let codigo = await prisma.codigodescuento.findFirst({
                where: {
                    id: ticket.idcodigo ?? 0
                }
            })
            if (codigo != null) {
                let totalactual = parseFloat(ticket.total?.toString() ?? "0")
                let descuento = parseFloat(codigo?.descuento?.toString() ?? "0")
                //restar porcentaje de descuento al total del costo actual
                let totalnew = totalactual - ((totalactual / 100) * descuento)

                let ticketupdate = await prisma.ticket.update({
                    where: {
                        id: idticket
                    },
                    data: {
                        total: totalnew
                    }
                })
            }
        }
        return true
    } catch (error) {
        return false
    }
}

export const AssignarDescuento = async (idticket: number, uuidticket: string) => {
    try {
        const codigo = await prisma.codigodescuento.findFirst({
            where: {
                uuidkey: uuidticket
            }
        })

        const ticket = await prisma.ticket.update({
            where: {
                id: idticket
            },
            data: {
                idcodigo: codigo?.id
            }
        })

        if (codigo?.idcatcodigo == 1) {
            await prisma.codigodescuento.update({
                where: {
                    id: codigo.id
                },
                data: {
                    replicas: ((codigo.replicas ?? 0) - 1),
                    terminado: true
                }
            })
            return true

        }
        else if (codigo?.idcatcodigo == 2 && codigo.terminado == false) {
            await prisma.codigodescuento.update({
                where: {
                    id: codigo.id
                },
                data: {
                    replicas: ((codigo.replicas ?? 0) - 1),
                    terminado: true
                }
            })
            return true

        }
        else if (codigo?.idcatcodigo == 2 && codigo.terminado == null) {
            await prisma.codigodescuento.update({
                where: {
                    id: codigo.id
                },
                data: {
                    replicas: ((codigo.replicas ?? 0) - 1),
                    terminado: false
                }
            })
            return true

        }

        return false
    } catch (error) {
        return false
    }
}

export const codigoisValidFecha = async (idcodigouuid: string) => {
    try {
        const codigo = await prisma.codigodescuento.findFirstOrThrow({
            where: {
                uuidkey: idcodigouuid
            }
        })

        if (codigo != null) {
            let fechaactual = DateTime.fromISO(DateTime.now().toString())
            let fechacodigo = DateTime.fromISO(codigo.fechavigencia?.toISOString() ?? "2000-01-01")
            if (fechacodigo >= fechaactual) {
                return true
            }
        }
        return false

    } catch (error) {
        return false
    }
}

export const codigoValidoInstancia = async (idcodigouuid: string) => {
    try {
        const codigo = await prisma.codigodescuento.findFirstOrThrow({
            where: {
                uuidkey: idcodigouuid
            }
        })

        if (codigo != null) {
            let replicas = parseInt(codigo.replicas?.toString() ?? "0")
            if (replicas > 0) {
                return true
            }
        }
        return false

    } catch (error) {
        return false
    }
}

export const ticketHaveCode = async (idticket: number) => {
    try {
        let ticket = await prisma.ticket.findFirstOrThrow({
            where: {
                id: idticket
            }
        })
        if (ticket.idcodigo != null)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}