export interface FormularioState {
    nombre?: string;
    email: string;
    password: string;
    repetirPassword?: string;
}

//!----------------------------------------------------------------------------//

export interface FormularioProyectoState {
    _id?: string,
    id?: string | null,
    colaboradores?: ColaboradorState[],
    tareas?: FormularioTareaState[],
    creador?: string,
    nombre: string,
    descripcion?: string,
    fechaEntrega?: string,
    cliente?: string,
}

//!----------------------------------------------------------------------------//

export interface FormularioTareaState {
    _id?: string,
    id?: string | null,
    estado?: string,
    completado?: { nombre: string },
    proyecto?: string,
    nombre?: string,
    descripcion?: string,
    fechaEntrega: string,
    prioridad?: string,
}

//!----------------------------------------------------------------------------//

export interface ColaboradorState {
    _id?: string,
    nombre?: string,
    email?: string,
}

