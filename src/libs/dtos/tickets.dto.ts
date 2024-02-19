
export interface ticketsDto{
    id: number,
    fechainicio: Date,
    fechafinal: Date,
    nombre: string,
    category: cat_ticketDto,
    servicios: Array<ServicioDto>
}

export interface cat_ticketDto{
    id: number
    nombre: string
}

export interface ServicioDto{
    id: number,
    nombre: string,
    costo: number
}



