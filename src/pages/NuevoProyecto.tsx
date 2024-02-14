import { FormularioProyecto } from "../components"

//!----------------------------------------------------------------------------//

export const NuevoProyecto: React.FC = () => {
    return (
        <>
            <h1 className="text-4xl font-black">Crear Proyecto</h1>
            <div className="mt-10 flex justify-center">
                <FormularioProyecto />
            </div>
        </>
    )
}
