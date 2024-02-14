import { useContext } from "react";
import { ProyectosContext } from "../context";

const useProyectos = () => {
    return useContext(ProyectosContext)
}

export default useProyectos