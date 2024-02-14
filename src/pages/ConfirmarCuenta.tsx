import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Alerta } from "../components"
import { AlertaState } from '../interfaces/index';
import clienteAxios from "../config/clienteAxios";

//!----------------------------------------------------------------------------//

export const ConfirmarCuenta: React.FC = () => {

  const [alerta, setAlerta] = useState<AlertaState>({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState<Boolean>(false)

  const params = useParams<string>()
  const { id } = params

  //* ----------------------------------------------------------------------------------------- *//

  useEffect(() => {
    const confirmarCuenta = async (): Promise<void> => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios(url)

        setAlerta({
          msg: data.msg,
          error: false
        })

        setCuentaConfirmada(true)
      } catch (error) {
        setAlerta({
          msg: (error as any).response.data.msg || 'Se produjo un error desconocido',
          error: true
        });
      }
    }

    return () => { confirmarCuenta() }
  }, [])

  const { msg } = alerta

  //!----------------------------------------------------------------------------//

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirma tu cuenta y comienza a crear tus {''}
        <span className="text-slate-700">proyectos</span>
      </h1>

      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta alerta={alerta} />}
        {cuentaConfirmada && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to='/'
          >Inicia Sesion</Link>
        )}
      </div>
    </>
  )
}
