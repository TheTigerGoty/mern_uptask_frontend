import React, { ReactNode, createContext, useEffect, useState } from 'react';
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom';
import { AlertaState, ColaboradorState, FormularioProyectoState, FormularioTareaState } from '../interfaces';
import io, { Socket } from 'socket.io-client'
import { useAuth } from '../hooks';

let socket: Socket

//!----------------------------------------------------------------------------//

interface ProyectosContextProps {
    alerta: AlertaState;
    proyectos: FormularioProyectoState[];
    proyecto: FormularioProyectoState;
    tarea: FormularioTareaState;
    colaborador: ColaboradorState;
    cargando: boolean;
    modalFormularioTarea: boolean;
    modalEliminarTarea: boolean;
    modalEliminarColaborador: boolean;
    buscador: boolean;
    mostrarAlerta: (alerta: AlertaState) => void;
    submitProyecto: (proyecto: FormularioProyectoState) => void;
    submitTarea: (tarea: FormularioTareaState) => void;
    handleModalEditarTarea: (tarea: FormularioTareaState) => void;
    handleModalEliminarTarea: (tarea: FormularioTareaState) => void;
    submitTareasProyecto: (tarea: FormularioTareaState) => void;
    eliminarTareaProyecto: (tarea: FormularioTareaState) => void;
    actualizarTareaProyecto: (tarea: FormularioTareaState) => void;
    cambiarEstadoTarea: (tarea: FormularioTareaState) => void;
    handleModalEliminarColaborador: (colaborador: ColaboradorState) => void;
    obtenerProyecto: (id: string) => void;
    eliminarProyecto: (id: string) => void;
    completarTarea: (id: string) => void;
    submitColaborador: (email: string) => void;
    agregarColaborador: (email: string) => void;
    handleModalTarea: () => void;
    eliminarTarea: () => void;
    eliminarColaborador: () => void;
    handleBuscador: () => void;
    cerrarSesionProyectos: () => void;
}

interface ProyectosProviderProps {
    children: ReactNode;
}

//!----------------------------------------------------------------------------//

const ProyectosContext = createContext<ProyectosContextProps>({
    alerta: { msg: '', error: false },
    proyectos: [],
    proyecto: { nombre: '' },
    tarea: { fechaEntrega: '' },
    colaborador: { _id: '' },
    cargando: false,
    modalFormularioTarea: false,
    modalEliminarTarea: false,
    modalEliminarColaborador: false,
    buscador: false,
    mostrarAlerta: () => { },
    submitProyecto: () => { },
    submitTarea: () => { },
    handleModalEditarTarea: () => { },
    handleModalEliminarTarea: () => { },
    submitTareasProyecto: () => { },
    eliminarTareaProyecto: () => { },
    actualizarTareaProyecto: () => { },
    cambiarEstadoTarea: () => { },
    handleModalEliminarColaborador: () => { },
    obtenerProyecto: () => { },
    eliminarProyecto: () => { },
    completarTarea: () => { },
    submitColaborador: () => { },
    agregarColaborador: () => { },
    handleModalTarea: () => { },
    eliminarTarea: () => { },
    eliminarColaborador: () => { },
    handleBuscador: () => { },
    cerrarSesionProyectos: () => { },
});

const ProyectosProvider: React.FC<ProyectosProviderProps> = ({ children }) => {

    const [proyectos, setProyectos] = useState<FormularioProyectoState[]>([]);
    const [alerta, setAlerta] = useState<AlertaState>({});
    const [proyecto, setProyecto] = useState<FormularioProyectoState>({ nombre: '' });
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState<FormularioTareaState>({ fechaEntrega: '' });
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState<ColaboradorState>({});
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [buscador, setBuscador] = useState(false);

    const navigate = useNavigate();
    const { auth } = useAuth();

    const obtenerConfiguracionConToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };
    };

    //* ----------------------------------------------------------------------------------------- *//

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const config = obtenerConfiguracionConToken();
                if (!config) return;

                const { data } = await clienteAxios('/proyectos', config);
                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos();
    }, [auth])

    //* ----------------------------------------------------------------------------------------- *//

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, []);

    //* ----------------------------------------------------------------------------------------- *//

    const mostrarAlerta = (alerta: AlertaState) => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }

    //* ----------------------------------------------------------------------------------------- *//

    const submitProyecto = async (proyecto: FormularioProyectoState) => {

        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
    };

    //* ----------------------------------------------------------------------------------------- *//

    const editarProyecto = async (proyecto: FormularioProyectoState) => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);

            //Sincronizar el State
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState);

            setProyectos(proyectosActualizados);

            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            });

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const nuevoProyecto = async (proyecto: FormularioProyectoState) => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.post('/proyectos', proyecto, config);

            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            });

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        };
    }

    //* ----------------------------------------------------------------------------------------- *//

    const obtenerProyecto = async (id: string) => {
        setCargando(true)
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data);
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: (error as any).response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const eliminarProyecto = async (id: string) => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            // Sincronizar el state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({} as FormularioTareaState);
    }

    //* ----------------------------------------------------------------------------------------- *//

    const submitTarea = async (tarea: FormularioTareaState) => {

        if (tarea?.id) {
            await editarTarea(tarea);
        } else {
            await crearTarea(tarea);
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const crearTarea = async (tarea: FormularioTareaState) => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.post(`/tareas`, tarea, config)
            //Agregar la tares al State

            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET IO
            socket.emit('nueva tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const editarTarea = async (tarea: FormularioTareaState) => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET
            socket.emit('actualizar tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const handleModalEditarTarea = (tarea: FormularioTareaState) => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    //* ----------------------------------------------------------------------------------------- *//

    const handleModalEliminarTarea = (tarea: FormularioTareaState) => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    //* ----------------------------------------------------------------------------------------- *//

    const eliminarTarea = async () => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

            setProyecto(proyectoActualizado => ({
                ...proyectoActualizado,
                tareas: proyectoActualizado.tareas
                    ? proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
                    : []
            }));

            setAlerta({
                msg: data.msg,
                error: false
            })

            setModalEliminarTarea(false)

            // SOCKET
            socket.emit('eliminar tarea', tarea)

            setTarea({} as FormularioTareaState)
            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const submitColaborador = async (email: string) => {

        setCargando(true);
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: (error as any).response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const agregarColaborador = async (email: string) => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, { email }, config)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 3000);

        } catch (error) {
            setAlerta({
                msg: (error as any).response.data.msg,
                error: true
            })
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const handleModalEliminarColaborador = (colaborador: ColaboradorState) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    //* ----------------------------------------------------------------------------------------- *//

    const eliminarColaborador = async () => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)

            const proyectoActualizado = { ...proyecto, colaboradores: proyecto?.colaboradores ?? [] }

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
            }, 3000);

        } catch (error) {
            console.log((error as any).response)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const completarTarea = async (id: string) => {
        try {
            const config = obtenerConfiguracionConToken();
            if (!config) return;

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            setProyecto(proyectoActualizado => ({
                ...proyectoActualizado,
                tareas: proyectoActualizado.tareas
                    ? proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
                    : []
            }));

            setTarea({} as FormularioTareaState)
            setAlerta({})

            // socket
            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log((error as any).response)
        }
    }

    //* ----------------------------------------------------------------------------------------- *//

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //* ----------------------------------------------------------------------------------------- *//

    // Socket io
    const submitTareasProyecto = (tarea: FormularioTareaState) => {
        const proyectoActualizado = { ...proyecto };

        proyectoActualizado.tareas = proyectoActualizado.tareas || [];
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];

        setProyecto(proyectoActualizado);
    };

    //* ----------------------------------------------------------------------------------------- *//

    const eliminarTareaProyecto = (tarea: FormularioTareaState) => {
        const proyectoActualizado = { ...proyecto };

        if (proyectoActualizado.tareas) {
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        }
        setProyecto(proyectoActualizado);
    };

    //* ----------------------------------------------------------------------------------------- *//

    const actualizarTareaProyecto = (tarea: FormularioTareaState) => {
        const proyectoActualizado = { ...proyecto }

        if (proyectoActualizado.tareas) {
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        }
        setProyecto(proyectoActualizado)
    }

    //* ----------------------------------------------------------------------------------------- *//

    const cambiarEstadoTarea = (tarea: FormularioTareaState) => {
        const proyectoActualizado = { ...proyecto }

        if (proyectoActualizado.tareas) {
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        }
        setProyecto(proyectoActualizado)
    }

    //* ----------------------------------------------------------------------------------------- *//

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({} as FormularioProyectoState)
        setAlerta({})
    }

    //!----------------------------------------------------------------------------//

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
};

//!----------------------------------------------------------------------------//

export {
    ProyectosProvider
};

export default ProyectosContext;