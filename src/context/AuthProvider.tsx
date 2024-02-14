import React, { ReactNode, createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";

//!----------------------------------------------------------------------------//

interface AuthData {
    _id?: string
    nombre?: string
}

interface AuthContextProps {
    auth: AuthData;
    setAuth: React.Dispatch<React.SetStateAction<AuthData>>;
    cargando: boolean;
    cerrarSesionAuth: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

//!----------------------------------------------------------------------------//

const AuthContext = createContext<AuthContextProps>({
    auth: {},
    setAuth: () => { },
    cargando: true,
    cerrarSesionAuth: () => { },
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [auth, setAuth] = useState<AuthData>({});
    const [cargando, setCargando] = useState<boolean>(true);

    //* ----------------------------------------------------------------------------------------- *//

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
            } catch (error) {
                setAuth({})
            } finally {
                setCargando(false)
            }

        }
        autenticarUsuario()
    }, [])

    //* ----------------------------------------------------------------------------------------- *//

    const cerrarSesionAuth = () => {
        setAuth({});
    };

    //!----------------------------------------------------------------------------//

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
};

//!----------------------------------------------------------------------------//

export {
    AuthProvider
};

export default AuthContext;