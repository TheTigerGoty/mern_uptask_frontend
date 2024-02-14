import { useEffect, useState } from "react"
import { useProyectos } from "../hooks"
import { Alerta } from "."
import { FormularioProyectoState } from "../interfaces"
import { useParams } from "react-router-dom"

//!----------------------------------------------------------------------------//

export const FormularioProyecto: React.FC = () => {

    const [id, setId] = useState<string | null>(null);
    const [formulario, setFormulario] = useState<FormularioProyectoState>({
        nombre: '',
        descripcion: '',
        fechaEntrega: '',
        cliente: '',
    })

    const params = useParams();
    const { nombre, descripcion, fechaEntrega, cliente } = formulario
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

    //* ----------------------------------------------------------------------------------------- *//

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormulario({
            ...formulario,
            [e.target.id]: e.target.value,
        });
    };

    //* ----------------------------------------------------------------------------------------- *//

    useEffect(() => {
        if (params.id && 'nombre' in proyecto && 'descripcion' in proyecto && 'fechaEntrega' in proyecto && 'cliente' in proyecto) {
            setId(proyecto._id || null);
            setFormulario({
                nombre: proyecto.nombre,
                descripcion: proyecto.descripcion,
                fechaEntrega: proyecto.fechaEntrega?.split('T')[0] || '',
                cliente: proyecto.cliente
            });
        }
    }, [params]);

    //* ----------------------------------------------------------------------------------------- *//

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (Object.values(formulario).includes('')) {
            mostrarAlerta({
                msg: 'Todos los Campos son Obligatorios',
                error: true
            })
            return
        }

        //Pasar datos hacia el provider
        await submitProyecto({
            id,
            nombre: formulario.nombre,
            descripcion: formulario.descripcion,
            fechaEntrega: formulario.fechaEntrega,
            cliente: formulario.cliente,
        });

        setId(null)
        setFormulario({
            nombre: '',
            descripcion: '',
            fechaEntrega: '',
            cliente: '',
        })
    }

    const { msg } = alerta

    //!----------------------------------------------------------------------------//

    return (
        <form
            className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}
        >

            {msg && <Alerta alerta={alerta} />}

            <div className="mb-5">
                <label
                    htmlFor="nombre"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Nombre Proyecto
                </label>
                <input
                    id="nombre"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Proyecto"
                    value={nombre}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label
                    htmlFor="descripcion"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Descripcion
                </label>
                <textarea
                    id="descripcion"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Descripcion del Proyecto"
                    value={descripcion}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label
                    htmlFor="fechaEntrega"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Fecha entrega
                </label>
                <input
                    id="fechaEntrega"
                    type="date"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={fechaEntrega}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label
                    htmlFor="cliente"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Nombre cliente
                </label>
                <input
                    id="cliente"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Cliente"
                    value={cliente}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
            />
        </form>
    )
}