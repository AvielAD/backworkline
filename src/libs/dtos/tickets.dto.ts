
export interface ticketsDto{
    id: number,
    uuid: string,
    fechainicio: string,
    fechafinal: string,
    nombre: string,
    total: number,
    estado: string,
    category: cat_ticketDto,
    servicios: Array<ServicioDto>
}

export interface createTicketDto{
    nombre: string,
    idcatticket: number
}

export interface cat_ticketDto{
    id: number
    nombre: string
}

export interface ServicioDto{
    id: number,
    nombre: string,
    costo: number,
    includepay: boolean
}

export interface servicioinputdto{
    idcatservicio: number
}

export interface servicioinputfulldto{
    idticket: number,
    idcatservicio: number
}
export interface assigncode{
    idcodigouuid: string,
    idticket: number
}

