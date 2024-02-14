import { Navigate, Outlet } from "react-router-dom"
import { Header, Sidebar } from "../components"
import useAuth from "../hooks/useAuth"

//!----------------------------------------------------------------------------//

export const RutaProtegida = () => {

    const { auth, cargando } = useAuth()

    if (cargando) return 'Cargando...'

    //!----------------------------------------------------------------------------//

    return (
        <>
            {auth._id ? (
                <div className="bg-gray-100">
                    <Header />

                    <div className="md:flex md:min-h-screen">
                        <Sidebar />

                        <main className="p-10 flex-1">
                            <Outlet />
                        </main>
                    </div>
                </div>
            ) : <Navigate to='/' />}
        </>
    )
}
