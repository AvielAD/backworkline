export interface ServerResponseDTO{
    message: string,
    succeeded: boolean,
}

export interface ServerResponseLoginDTO{
    message: string,
    succeeded: boolean,
    data: UserInfoLogin | null
}

export interface UserInfoLogin{
    email: string,
    nombre: string,
    token: string,
}

export interface ServerResponseDataDto{
    message: string,
    succeeded: boolean,
    data: any
}