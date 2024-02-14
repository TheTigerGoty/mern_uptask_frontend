import { useAuth, useProyectos } from ".";

const useAdmin = () => {
    const { proyecto } = useProyectos()
    const { auth } = useAuth()
    return proyecto.creador === auth._id
}

export default useAdmin