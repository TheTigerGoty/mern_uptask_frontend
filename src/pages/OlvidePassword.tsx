import { useState } from "react"
import { Link } from "react-router-dom"
import { Alerta } from "../components"
import { AlertaState } from '../interfaces/index';
import clienteAxios from "../config/clienteAxios";

//!----------------------------------------------------------------------------//

export const OlvidePassword: React.FC = () => {

    const [email, setEmail] = useState<string>('')
    const [alerta, setAlerta] = useState<AlertaState>({})

    const emailPattern: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

      //* ----------------------------------------------------------------------------------------- *//

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (email === '' || !emailPattern.test(email)) {
            setAlerta({
                msg: 'El Email es Obligatorio o tiene un formato incorrecto',
                error: true
            })
            return
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })

            setAlerta({
                msg: data.msg,
                error: false
            })
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
                Recupera tu acceso y no pierdas tus {''}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            <form
                noValidate
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}>
                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="email"
                    >Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <input
                    type="submit"
                    value='Enviar Instrucciones'
                    className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to='/'
                >¿Ya tienes una cuenta? Inicia Sesion</Link>

                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to='/registrar'
                >¿No tienes una cuenta? Registrate</Link>
            </nav>
        </>
    )
}
