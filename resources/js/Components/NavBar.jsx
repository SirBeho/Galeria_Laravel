import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FaWhatsapp } from 'react-icons/fa';

// Componentes y Contextos
import Modal from "@/Components/Modal";
import CarritoComponente from "./CarritoComponente"; // Asegúrate de que CarritoComponente use useCarrito()
import UserDropdown from "./UserDropdown";
import { useCarrito } from '@/Contexts/CarritoContext'; // 🟢 Contexto Carrito
import { useVisual } from '@/Contexts/VisualContext';   // 🟢 Contexto Visual

// NOTA: Debes importar axios en el componente si lo usas en handleOrderSent
import axios from 'axios'; 


export default function NavBar({ user }) {
    
    // --- CONSUMO DE CONTEXTOS ---
    // Carrito: Para el contador, el estado activo y el setter del modal.
    const { carrito, setCarrito, isActive: isCarritoActive } = useCarrito();
    
    // Visual: Para los botones de vista y el modo eliminar.
    const { 
        verJuegos, 
        toggleVerJuegos, 
        estadoVisual, 
        cycleEstadoVisual, 
        showEliminar, 
        toggleDeleteMode,
        isActive: isVisualActive 
    } = useVisual();

    // --- ESTADOS LOCALES ---
    const [enviado, setEnviado] = useState(false);
    const [pedidoCreado, setPedidoCreado] = useState(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    
    // --- LÓGICA DE NAVEGACIÓN ---
    const { url } = usePage();
    const isHome = url === '/';

    // Se ejecuta al cerrar el modal de pedido
    useEffect(() => {
        // console.log('Carrito en Nav:', carrito);
        // Si el CarritoComponente usa useCarrito(), este useEffect es redundante
    }, [carrito]); 

    // Lógica de WhatsApp consolidada
    const handleSendOrder = () => {
        if (pedidoCreado?.whatsappLink) {
            window.open(pedidoCreado.whatsappLink, '_blank');
            setEnviado(true);
        }
    }

    // Finalización del pedido (se llama después de confirmar en WhatsApp)
    const handleOrderSent = () => {
        if (pedidoCreado?.pedido?.id) {
            axios.post(route("pedido.sent", { id: pedidoCreado.pedido.id }))
                .then(() => {
                    setCarrito([]); // 🟢 Usa setCarrito del Contexto
                    setPedidoCreado(null);
                    setEnviado(false);
                })
                .catch(error => {
                    console.error("Error al marcar pedido como enviado:", error);
                });
        }
    }

  return (
    <>
      <nav className=" text-white bg-nav fixed top-0 w-full z-20 p-2">

        <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 md:px-8 h-10">
          {/* 1. SECCIÓN IZQUIERDA (Logo y Toggles) */}
          <div className="h-full flex items-center gap-4 ">
            {/* Logo */}
            <div className="h-full flex gap-3 items-center cursor-pointer hover:scale-105 rounded-md">
                <img src="favico.png" className="h-full w-auto" alt="Logo" />
                <a className="text-white text-xl md:text-2xl w-auto hidden sm:block " href="./">Mundo del Cumpleaños  </a> {/* Ocultar título en móvil, mostrar en sm+ */}
            </div>
            {/* Toggle JUGUETES/TODOS (Solo en Home) */}
            {isHome && (
                <button onClick={toggleVerJuegos}
                    // Tamaño y margen ajustados para ser menos invasivos en móvil
                    className="text-white text-sm md:text-base font-bold rounded-lg hover:scale-110 hover:cursor-pointer hover:text-blue-500 hover:fill-blue-500">
                    {verJuegos ? '🧸 JUGUETES' : '🎉 TODOS'}
                </button>
            )}
          </div>

          {/* 2. SECCIÓN DERECHA (Carrito, Usuario, Visualización) */}
          <div className="flex items-center space-x-3 sm:space-x-5">

            {/* Botón Carrito */}
            {carrito.length > 0 && (
              <div
                className="bg-blue-600 rounded-md p-1 scale-75 md:scale-100 flex items-center gap-2 cursor-pointer transition-colors hover:bg-blue-700"
                onClick={() => setIsCartModalOpen(true)}>
                <img src="carrito.svg" alt="Carrito" className="w-5 h-5" />
                <span className="text-black bg-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                  {carrito.length}
                </span>
              </div>
            )}
            {user ?
              (
                <UserDropdown user={user} showEliminar={showEliminar} toggleDeleteMode={toggleDeleteMode} />
              )
              :
              (
                <Link href={route('login')} className='flex ms-4 gap-2 items-center cursor-pointer hover:scale-110 hover:text-blue-500 hover:fill-blue-500'>
                  Login
                </Link>
              )}
            {isHome && (
              <div className=" h-4 w-4 self-center cursor-pointer hover:scale-110" onClick={cycleEstadoVisual}>
                {estadoVisual === 0 && <img src="tres.svg" alt="grande" />}
                {estadoVisual === 1 && <img src="dos.svg" alt="mediano" />}
                {estadoVisual === 2 && <img src="uno.svg" alt="pequeño"  />}
              </div>)}
          </div>
        </div>
      </nav>

      <Modal show={pedidoCreado != null} closeable={false} header={"Enviando a WhatsApp"} close_x={false}>
        <div className='flex flex-col justify-center items-center text-center'>
          <div className='py-8 text-2xl'>Su pedido se ha creado exitosamente <br /> Pedido no: {pedidoCreado?.pedido.numero_pedido}</div>
          {pedidoCreado?.whatsapp_response?.messages?.[0]?.message_status == 'accepted' ? (
            <>
              <div className='flex flex-col justify-center items-center text-center'>
                <span className='text-base'>Su Pedido ah sido enviado</span>
              </div>
              <button type='button' onClick={handleOrderSent} className='bg-green-500 mt-8 my-2 w-fit px-2 rounded-md hover:bg-green-400 text-white p-1'>Finalizar!!</button>
            </>
          )
            : (<>
              {enviado ? (
                <div className='flex flex-col justify-center items-center text-center'>
                  <span className='text-sm'>Si su pedido aun no se ah enviado, intentelo nuevamente</span>
                </div>
              ) : (
                <span className='text-sm'>Haga clic aquí para enviarlo a WhatsApp</span>
              )}
              <FaWhatsapp onClick={handleSendOrder} className="cursor-pointer w-32 h-24 text-[#25d366] hover:scale-110 hover:text-green-500" />
              {enviado && (
                <button type='button' onClick={handleOrderSent} className='bg-green-500 mt-8 my-2 w-fit px-2 rounded-md hover:bg-green-400 text-white p-1'>!! Mi pedido ya fue enviado</button>
              )}
            </>
            )}
        </div>
      </Modal>

      <Modal show={isCartModalOpen} close_x={true} header={"Datos de Pedido"} onClose={() => { setIsCartModalOpen(false) }}>
        <CarritoComponente setPedidoCreado={setPedidoCreado} />
      </Modal>
    </>
  );
}
