import { useProyectos } from "../hooks"
import { ColaboradorState } from "../interfaces";

//!----------------------------------------------------------------------------//

interface ColaboradorProps {
    colaborador: ColaboradorState;
}

//!----------------------------------------------------------------------------//

export const Colaborador: React.FC<ColaboradorProps> = ({ colaborador }) => {
    
    const { handleModalEliminarColaborador } = useProyectos()
    const { nombre, email } = colaborador

    //!----------------------------------------------------------------------------//

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div>
                <p>{nombre}</p>
                <p className="text-sm text-gray-700">{email}</p>
            </div>

            <div>
                <button
                    type="button"
                    className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={() => handleModalEliminarColaborador(colaborador)}
                >Eliminar</button>
            </div>
        </div>
    )
}
