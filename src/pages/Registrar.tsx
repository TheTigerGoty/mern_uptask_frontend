import React, { FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { AlertaState, FormularioState } from '../interfaces/index';
import { Alerta } from "../components"
import clienteAxios from "../config/clienteAxios";

//!----------------------------------------------------------------------------//

export const Registrar: React.FC = () => {

    const [formulario, setFormulario] = useState<FormularioState>({
        nombre: '',
        email: '',
        password: '',
        repetirPassword: '',
    })

    const {nombre, email, password, repetirPassword} = formulario

    const [alerta, setAlerta] = useState<AlertaState>({})

    //* ----------------------------------------------------------------------------------------- *//

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormulario({
            ...formulario,
            [e.target.id]: e.target.value,
        });
    };

    //* ----------------------------------------------------------------------------------------- *//

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (Object.values(formulario).some(value => value === '')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        if (formulario.password !== formulario.repetirPassword) {
            setAlerta({
                msg: 'Los Password no son iguales',
                error: true
            })
            return
        }

        if (formulario.password.length < 6) {
            setAlerta({
                msg: 'El Password es muy corto, agrega minimo 6 caracteres',
                error: true
            })
            return
        }

        //Crear el usuario en la API
        try {
            const { data } = await clienteAxios.post(`/usuarios`, formulario);
            setAlerta({
                msg: data.msg,
                error: false
            })

            setFormulario({
                nombre: '',
                email: '',
                password: '',
                repetirPassword: '',
            })
        } catch (error) {
            setAlerta({
                msg: (error as any).response.data.msg || 'Se produjo un error desconocido',
                error: true
            });
        }
    };

    const { msg } = alerta

    //!----------------------------------------------------------------------------//

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Crea tu cuenta y empieza a administrar tus {''}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            <form
                noValidate
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}
            >
                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="nombre"
                    >Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="Tu Nombre"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={nombre}
                        onChange={handleChange}
                    />
                </div>

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
                        onChange={handleChange}
                    />
                </div>

                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="password"
                    >Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={password}
                        onChange={handleChange}
                    />
                </div>

                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="repetirPassword"
                    >Repetir Password</label>
                    <input
                        id="repetirPassword"
                        type="password"
                        placeholder="Repetir tu Password"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={repetirPassword}
                        onChange={handleChange}
                    />
                </div>

                <input
                    type="submit"
                    value='Crear Cuenta'
                    className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                />
            </form>

            <nav>
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to='/'
                >¿Ya tienes una cuenta? Inicia Sesion</Link>
            </nav>
        </>
    )
}
