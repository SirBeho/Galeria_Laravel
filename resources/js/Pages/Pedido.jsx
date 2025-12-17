
import Layout from '@/Layouts/Layout';
import React, { useState } from "react";
import { Head, Link, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { useEffect } from 'react';

export default function Pedido({ pedido, user, mensaje, galleryUrl }) {

  const background = ['bg-red-500', 'bg-yellow-300', 'bg-yellow-300', 'bg-green-500'];

  const [msj, setMsj] = useState(mensaje);

  useEffect(() => {
    if (mensaje) {
      //console.log(mensaje)
      setMsj(mensaje);
    }
  }, [mensaje]);

  const [modalImg, setModalImg] = useState("");

  const { post } = useForm({
  });

  const [estado, setEstado] = useState(pedido.status);

  return (
    <Layout user={user}>
      <Head title="Pedido" />

      <div className='flex items-center gap-4 mb-2'>
        <Link href={user ? route('panel') : route('home')} className='text-blue-600 fill-blue-700  hover:scale-105  cursor-pointer h-10 w-10 min-w-[40px]   '>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" /></svg>
        </Link>

        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl whitespace-nowrap overflow-hidden text-ellipsis">
          Pedido No. {pedido.numero_pedido}
        </h1>
      </div>
      {/* <div className={`${background[estado]} mt-6 p-4 rounded-xl border border-gray-300 shadow-lg`}> */}
      <div className={`${background[estado]}   xl:mx-20  rounded-xl overflow-hidden bg-gray-50 border border-gray-300 shadow-lg`}>
        <div className="
            grid   gap-y-1 gap-x-6      /* Espacio entre ítems */
            grid-cols-1          
            sm:grid-cols-2       
            xl:grid-cols-4       
            p-2 text-lg sm:text-xl sm:gap-y-3
        ">

          <label className="flex   gap-1">
            <span className='font-bold'>Cliente:</span>
            <span className="w-full border rounded-md  border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap">{pedido.nombre}</span>
          </label>

          <label className="flex gap-1">
            <span className='font-bold'>Telefono:</span>
            <span className="w-full border rounded-md  border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap">{pedido.telefono}</span>
          </label>

          <label className="flex  gap-1">
            <span className='font-bold'>Fecha:</span>
            <span className="w-full border rounded-md  border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap">{pedido.fecha}</span>
          </label>

          <label className="flex  gap-1">
            <span className='font-bold'>Estado:</span>
            <select
              data-cy="status-select"
              className=" border  rounded-md border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap"
              value={pedido.status}
              onChange={(e) => {
                setEstado(e.target.value);
                post(route('pedido.status', { id: pedido.id, status: e.target.value }));
              }}
            >
              <option value="0">Cancelado</option>
              <option value="1">Pendiente</option>
              <option value="2">Pendiente + Ws</option>
              <option value="3">Completado</option>
            </select>
          </label>

        </div>

        <table className="border-t  border-black w-full text-lg text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
          <thead className="sm:table-header-group text-xs sm:text-base text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">Imagen</th>
              <th scope="col" className="px-6 py-3 text-center">Cantidad</th>
              <th scope="col" className="px-6 py-3">Comentario</th>
            </tr>
          </thead>
          <tbody data-cy="detalle-data-table" data-pedido-id={pedido.id}>

            {pedido.detalle?.map((item, index) => {
              return (
                <tr data-cy="detalle-row" key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 ">
                  <td onClick={() => setModalImg(`${galleryUrl}${item.codigo}`)}>
                    <img className="cursor-pointer h-40 object-cover  w-32 sm:w-40 rounded-lg" src={`${galleryUrl}${item.codigo}`} alt="foto" />
                  </td>
                  {/* <td className="sm:px-6 py-4">
                    {item.codigo}
                  </td> */}
                  <td data-cy="detalle-Quantity"
                    className="sm:px-6 py-4 text-center   ">
                    {item.cantidad}
                  </td>
                  <td className="sm:px-6 py-4 w-1/2">
                    {item.comentario}
                  </td>


                </tr>
              )
            })}
          </tbody>
        </table>

      </div>


      <div className='flex gap-3 justify-center'>

        <Link
          href={route('pedido.status', { id: pedido.id, status: 0 })}
          method="post"
          as="button"
          className='bg-red-500 my-2 w-fit px-2 rounded-md hover:bg-red-400 hover:scale-110 text-white p-1'
        >
          Cancelar Pedido
        </Link>
        <Link
          href={route('pedido.status', { id: pedido.id, status: 3 })}
          method="post"
          as="button"
          className='bg-green-500 my-2 w-fit px-2 rounded-md hover:bg-green-400 hover:scale-110 text-white p-1'
        >
          Marcar como completado
        </Link>



      </div>


      <Modal show={msj != null} onClose={() => setMsj(null)} header={"Productos Eliminados"} close_x={true}>
        {msj?.success && <div className="text-center text-green-600 text-xl" >
          <p>{msj.message}</p>
        </div>}

        {msj?.errors && <div className="text-center text-red-500 mt-4 text-sm">
          {msj.errors.map((error, index) => (
            <span className="block" key={index}>{error}</span>
          ))}
        </div>}

        <div className="flex justify-center mt-5" >
          <button onClick={() => setMsj(null)} type="button" className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500" >Cerrar</button>
        </div>
      </Modal>


      <Modal show={modalImg != ""} close_x={true} header={"Detalle del Artículo"} onClose={() => { setModalImg("") }}>
        <div className='flex justify-center bg-slate-100 p-2 rounded-md'>
          <div className="relative rounded-[0.5rem] overflow-hidden w-fit-content">
            <img id="modal-image" src={`${modalImg}`} className="img-fluid" alt="Imagen del artículo" />
            <img className="w-32 absolute bottom-0 left-0" src="logo.png" alt="Logo" />
            <span id="modal-codigo" className="absolute top-10 left-16 text-black bg-white rounded-8 px-5"></span>
          </div>
        </div>
      </Modal>




    </Layout>
  );
}
