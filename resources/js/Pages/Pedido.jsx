
import Layout from '@/Layouts/Layout';
import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Loading from '@/Components/Loading';

export default function Pedido({ pedido , user }) {

  const background =[ 'bg-red-500','bg-yellow-300','bg-yellow-300','bg-green-500'];
  
  const [modalImg, setModalImg] = useState("");

  const { data, setData, post, processing, errors, reset } = useForm({
  });
    
  const [estado, setEstado] = useState(pedido.status);

  return (
    <Layout user={user}>
      <Head title="Pedido" />

      <div className='flex items-center gap-4'>
      <Link href={route('panel')} className='text-blue-600 fill-blue-700  hover:scale-105  cursor-pointer h-14 w-14    '>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z"/>
          </svg>
      </Link>

      <h1 className="pt-4 my-4 font-bold text-4xl">
       Pedido No... {pedido.numero_pedido}
      </h1></div>

      <div className={`${background[estado]}       xl:mx-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-300 shadow-lg`}>
      <div className=" flex max-[500px]:flex-wrap  min-[500px]:gap-10 w-fit p-2 text-xl">

          <label className="flex  w-full gap-1">
            <span className='font-bold'>Cliente:</span>
            <span className="w-full border rounded-md  border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap">{pedido.nombre}</span>
          </label>

          <label className="flex  w-full gap-1">
            <span className='font-bold'>Telefono:</span>
            <span className="w-full border rounded-md  border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap">{pedido.telefono}</span>
          </label>

          <label className="flex  w-full gap-1">
            <span className='font-bold'>Fecha:</span>
            <span className="w-full border rounded-md  border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap">{pedido.fecha}</span>
          </label>

          <label className="flex w-full gap-1">
            <span className='font-bold'>Estado:</span>
            <select
              className="w-full border min-w-56 rounded-md border-none focus:outline-blue-300 p-0 px-2 whitespace-nowrap"
              value={pedido.status}
              onChange={(e) => {
                setEstado(e.target.value);
                post(route('pedido.status',{id:pedido.id,status:e.target.value}));
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
          <thead className=" text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="sm:px-6 py-3">
                Imagen
              </th>
              <th scope="col" className="sm:px-6 py-3">
                Código
              </th>
              <th scope="col" className="sm:px-6 py-3">
                Cantidad
              </th>
              <th scope="col" className="sm:px-6 py-3">
                Comentario
              </th>

            </tr>
          </thead>
          <tbody>

            {pedido.detalle?.map((item, index) => {
              return (
                <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 ">
                  <td onClick={()=> setModalImg(item.codigo)}>
                    <img className="cursor-pointer h-40 object-cover  w-32 sm:w-40 rounded-lg" src={`/images/${item.codigo}`} alt="foto" />
                  </td>
                  <td className="sm:px-6 py-4">
                    {item.codigo}
                  </td>
                  <td className="sm:px-6 py-4">
                    {item.cantidad}
                  </td>
                  <td className="sm:px-6 py-4">
                    {item.comentario}
                  </td>


                </tr>
              )
            })}
          </tbody>
        </table>

      </div>

    {false && 
      <div className='flex gap-3 justify-center'>
        
         <Link
                        href={route('pedido.status',{id:pedido.numero_pedido,status:0})}
                        method="post"
                        as="button"
                        className='bg-red-500 my-2 w-fit px-2 rounded-md hover:bg-red-400 hover:scale-110 text-white p-1'
                    >
                       Cancelar Pedido
                    </Link>
         <Link
                        href={route('pedido.status',{id:pedido.numero_pedido,status:3})}
                        method="post"
                        as="button"
                        className='bg-green-500 my-2 w-fit px-2 rounded-md hover:bg-green-400 hover:scale-110 text-white p-1'
                    >
                      Marcar como completado
                    </Link>
                  
     
        
      </div>
    }

      <Modal show={modalImg != ""} close_x={true} header={"Detalle del Artículo"} onClose={() => { setModalImg("")}}>
        <div className='flex justify-center bg-slate-100 p-2 rounded-md'>
          <div className="relative rounded-[0.5rem] overflow-hidden w-fit-content">
            <img id="modal-image" src={`images/${modalImg}`} className="img-fluid" alt="Imagen del artículo" />
            <img className="w-32 absolute bottom-0 left-0" src="logo.png" />
            <span id="modal-codigo" className="absolute top-10 left-16 text-black bg-white rounded-8 px-5"></span>
          </div>
        </div>
      </Modal>




    </Layout>
  );
}
