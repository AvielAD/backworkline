
export interface ticketsDto{
    id: number,
    uuid: string,
    fechainicio: Date,
    fechafinal: Date,
    nombre: string,
    total: number,
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



