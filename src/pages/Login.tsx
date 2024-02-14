import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alerta } from "../components"
import { AlertaState, FormularioState } from '../interfaces/index';
import clienteAxios from "../config/clienteAxios"
import { useAuth } from "../hooks";

//!----------------------------------------------------------------------------//

export const Login: React.FC = () => {

  const [formulario, setFormulario] = useState<FormularioState>({
    email: '',
    password: '',
  })

  const { email, password } = formulario
  const [alerta, setAlerta] = useState<AlertaState>({})
  const { setAuth } = useAuth();
  const navigate = useNavigate()

    //* ----------------------------------------------------------------------------------------- *//

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({
      ...formulario,
      [e.target.id]: e.target.value,
    });
  };

    //* ----------------------------------------------------------------------------------------- *//

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (Object.values(formulario).some(value => value === '')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    try {
      const { data } = await clienteAxios.post(`/usuarios/login`, formulario);

      setAlerta({
        msg: data.msg,
        error: false
      })

      localStorage.setItem('token', data.token);
      setAuth(data);
      navigate('/proyectos')

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
        Inicia sesion y administra tus {''}
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

        <input
          type="submit"
          value='Iniciar Sesion'
          className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to='/registrar'
        >¿No tienes una cuenta? Registrate</Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to='/olvide-password'
        >Olvide Mi Password</Link>
      </nav>
    </>
  )
}
