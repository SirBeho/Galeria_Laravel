import React, { useEffect, useState } from "react";
// import Image from 'next/image'


import Modal from "@/Components/Modal";
import Loading from "./Loading";
import CarritoComponente from "./CarritoComponente";
import { FaWhatsapp } from 'react-icons/fa';
import Dropdown from "./Dropdown";
import { Link } from "@inertiajs/react";


export default function NavBar({ carrito = {}, setNewCarrito, user }) {


  const enviarWhatapp = () => {

    window.open(pedidoCreado?.whatsappLink, '_blank');
    setEnviado(true);
  }

  const [enviado, setEnviado] = useState(false);

  const [pedidoCreado, setPedidoCreado] = useState(null);

  const [edit, setEdit] = useState(false);

  const pedido_enviado = () => {

    axios.post(route("pedido.sent", { id: pedidoCreado.pedido.id }))

    setNewCarrito([]),
      setPedidoCreado(null),
      setEnviado(false)
  }

  
  return (
    <>
      <nav className=" text-white bg-nav fixed top-0 w-full z-20 p-2">
        <div className="flex justify-between items-center md:px-52 h-10">

          <div className="h-full flex gap-3 items-center cursor-pointer hover:scale-105 px-4 rounded-md">
            <img src="favico.png" className="h-full w-auto" alt="" />
            <a className="text-white text-xl" href="./">Mundo del Cumpleaños</a>
          </div>



          <div className="flex ">


            {carrito.length > 0 && (
              <div className="bg-blue-600 rounded-md p-2 flex items-center gap-2 cursor-pointer" onClick={() => setEdit(true)} id="openModalButton" data-toggle="modal" data-target="#cartModal">
                <img src="carrito.svg" alt="" />
                <span id="cart-count" className="text-black bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  {carrito.length}
                </span>
              </div>

            )}
          {user ? (
              <div className=" sm:flex sm:items-center ">
                <div className=" relative">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <span className="inline-flex rounded-md">
                        <button
                          type="button"
                          className=" inline-flex items-center  px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-200   hover:text-gray-400 focus:outline-none transition ease-in-out duration-150"
                        >
                          <span>{user.name}</span>

                          <svg
                            className="ml-2 -mr-0.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                    <Dropdown.Link href={route('panel')} method="get" as="button">
                        Panel
                      </Dropdown.Link>
                      <Dropdown.Link href={route('logout')} method="post" as="button">
                        Log Out
                      </Dropdown.Link>
                      
                    </Dropdown.Content>
                  </Dropdown>
                </div>



              </div>
                 )
                :
                (
                  <Link href={route('login')}  className='flex ms-4 gap-2 items-center cursor-pointer hover:scale-110 hover:text-blue-500 hover:fill-blue-500'>
                                                     Login
                 </Link>

                )}
            </div>
              
          </div>
       
      </nav>

      <Modal show={pedidoCreado != null} closeable={false} header={"Enviando a WhatsApp"} close_x={false}>

        <div className='flex flex-col justify-center items-center text-center'>
          <div className='py-8 text-2xl'>Su pedido se ha creado exitosamente <br /> Pedido no: {pedidoCreado?.pedido.numero_pedido}</div>

          {enviado ? (
            <div className='flex flex-col justify-center items-center text-center'>
              <span className='text-sm'>Si su pedido aun no se ah enviado, intentelo nueva mente</span>
            </div>
          ) : (
            <span className='text-sm'>Haga clic aquí para enviarlo a WhatsApp</span>
          )}


          <FaWhatsapp onClick={() => enviarWhatapp()} className="cursor-pointer w-32 h-24 text-[#25d366] hover:scale-110 hover:text-green-500" />
          {enviado && (
            <button type='button' onClick={() => pedido_enviado()} className='bg-green-500 mt-8 my-2 w-fit px-2 rounded-md hover:bg-green-400 text-white p-1'>!! Mi pedido ya fue enviado</button>
          )}
        </div>


      </Modal>

      <Modal show={edit} close_x={true} header={"Datos del Carrito"} onClose={() => { setEdit(false) }}>
        <CarritoComponente carrito={carrito} setNewCarrito={setNewCarrito} setPedidoCreado={(val) => setPedidoCreado(val)} close={() => { setEdit(false) }} />
      </Modal>
    </>
  );



}
