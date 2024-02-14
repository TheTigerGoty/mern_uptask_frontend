import { FormEvent, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Alerta } from "../components"
import { AlertaState } from '../interfaces/index';
import clienteAxios from "../config/clienteAxios";

//!----------------------------------------------------------------------------//

export const NuevoPassword: React.FC = () => {

    const [password, setPassword] = useState<string>('');
    const [tokenValido, setTokenValido] = useState<boolean>(false);
    const [alerta, setAlerta] = useState<AlertaState>({});
    const [passwordModificado, setPasswordModificado] = useState<boolean>(false)

    const params = useParams()
    const { token } = params

      //* ----------------------------------------------------------------------------------------- *//

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)
                setTokenValido(true)
            } catch (error) {
                setAlerta({
                    msg: (error as any).response.data.msg || 'Se produjo un error desconocido',
                    error: true
                });
            }
        }
        return () => { comprobarToken() }
    }, [])

      //* ----------------------------------------------------------------------------------------- *//

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (password.length < 6) {
            setAlerta({
                msg: 'El Password debe ser minimo de 6 caracteres',
                error: true
            })
            return
        }

        try {
            const url = `/usuarios/olvide-password/${token}`
            const { data } = await clienteAxios.post(url, { password })

            setAlerta({
                msg: data.msg,
                error: false
            })
            setPasswordModificado(true);
        } catch (error) {
            setAlerta({
                msg: (error as any).response.data.msg || 'Se produjo un error desconocido',
                error: true
            });
        }
    }

    const { msg } = alerta

    //!----------------------------------------------------------------------------//

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Reestablece tu Password y no pierdas acceso a tus {''}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            {tokenValido && (
                <form
                    className="my-10 bg-white shadow rounded-lg p-10"
                    onSubmit={handleSubmit}
                >
                    <div className="my-5">
                        <label
                            className="uppercase text-gray-600 block text-xl font-bold"
                            htmlFor="password"
                        >Nuevo Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Escribe tu nuevo Password"
                            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <input
                        type="submit"
                        value='Guardar Nuevo Password'
                        className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                    />
                </form>
            )}

            {passwordModificado && (
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to='/'
                >Inicia Sesion</Link>
            )}
        </>
    )
}
