// CarritoComponente.js
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import React, { use, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input/input'
import Loading from './Loading';
import { useCarrito } from '@/Contexts/CarritoContext';
import { usePage } from '@inertiajs/react';

// ...

// Eliminamos Modal y set, ya que no se usan en este componente
// import Modal from '@/Components/Modal'; 
// import { set } from 'date-fns';

const CarritoComponente = ({ setPedidoCreado, setMsj }) => {

  const { galleryUrl } = usePage().props;

  const [loading, setLoading] = useState(false);

  const { carrito, setCarrito } = useCarrito();


  const { data, setData, post, transform, processing, errors } = useForm({
    nombre: "",
    telefono: "",
  });



  // Cargar datos de contacto (nombre/telefono) desde localStorage
  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem('perdatos'));
      if (guardado) {
        setData({
          nombre: guardado.nombre || "",
          telefono: guardado.telefono || ""
        });
      }
    } catch (e) {
      console.error("Error al cargar datos locales", e);
    }
  }, []);

  // Guardar datos de contacto al cambiar
  useEffect(() => {
    if (data.nombre || data.telefono) {
      localStorage.setItem('perdatos', JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const eliminarDelCarrito = (indice) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== indice);
    setCarrito(nuevoCarrito);
  };

  const Limpiar = () => {
    setCarrito([]);
    localStorage.removeItem('carrito');
  };

  const enviarPedido = (e) => {

    e.preventDefault();

    // Validación básica de campos
    if (carrito.length === 0) {
      // Mantenemos este check porque Inertia no valida si el carrito está vacío
      alert("El carrito está vacío. Agregue artículos para continuar.");
      return;
    }

    transform((currentData) => ({
      ...currentData,
      carrito
    }));

    post(route("pedido.add"), {
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
      onSuccess: (response) => {
        alert(response.props.flash.success);
        setPedidoCreado(response.props.flash.pedido_status);
        Limpiar();
      },
      onError: (errors) => {
        setMsj({
          errors: Object.values(errors),
          success: false
        })
        console.error("Errores de validación:", errors);
      }
    });
  }






  // Función de validación ya no es necesaria si PhoneInput se encarga del patrón
  // function isValidPhoneNumber(phoneNumber) {
  //     return /^\(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber);
  // }


  return (
    <div className="flex flex-col h-full bg-white relative">
      <Loading show={processing} />


      <form onSubmit={enviarPedido} className="flex flex-col h-full">
        {/* 1. SECCIÓN DE CONTACTO */}
        <div className="p-2 border-b bg-gray-50">
          <h3 className="text-base font-bold text-gray-800 mb-1">Información de Contacto</h3>
          {/* INPUT NOMBRE */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex flex-col w-full text-sm font-medium text-gray-600">
              Nombre:
              <input
                data-cy="input-nombre"
                placeholder="Ingrese su nombre"
                required={true}
                value={data.nombre}
                onChange={(e) => { setData("nombre", e.target.value) }}
                type="text"
                className="w-full border border-gray-300 rounded-lg p-1 mt-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </label>

            {/* INPUT TELÉFONO */}
            <label className="flex flex-col w-full text-sm font-medium text-gray-600">
              Teléfono:
              <PhoneInput
                data-cy="input-telefono"
                country='DO'
                value={data.telefono}
                onChange={(e) => setData("telefono", e)}
                className="w-full border border-gray-300 rounded-lg p-1 mt-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(000) 000-0000"
                pattern="^\(\d{3}\) \d{3}-\d{4}$"
                required={true}
              />
              {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
            </label>
          </div>
        </div>

        {/* 2. SECCIÓN DE ARTÍCULOS (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
            Artículos ({carrito?.length || 0})
            {carrito?.length > 0 && (
              <button
                data-cy="clear-carrito-btn"
                onClick={Limpiar}
                type='button'
                className='text-xs font-medium text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors'
              >
                Vaciar Carrito
              </button>
            )}
          </h3>

          {carrito.length === 0 ? (
            <p className="text-gray-500 text-center py-8">El carrito está vacío. Agregue artículos para continuar.</p>
          ) : (
            <div data-cy="cart-item-list" className="space-y-2">
              {carrito?.map((item, index) => (
                <div data-cy="cart-item-row" key={index} className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-3 items-center">
                  {/* Imagen */}
                  <img
                    className="h-16 w-16 object-cover rounded-md flex-shrink-0 mr-4"
                    src={`${galleryUrl}${item.codigo}`}
                    alt={`Artículo ${item.codigo}`}
                  />

                  {/* Detalles */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {'IMG' + item.codigo?.split('/').pop().split('.').slice(0, -1).join('.') || ''}
                    </p>
                    <p data-cy="cart-item-quantity"
                      className="text-sm text-gray-500">
                      Cant: <span className="font-bold">{item.cantidad}</span>
                    </p>
                    {item.comentario && (
                      <p data-cy="cart-item-comment"
                        className="text-xs text-blue-600 italic mt-1">
                        &quot;{item.comentario}&quot;
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  <button
                    type='button'
                    className='text-gray-400 hover:text-red-500 p-2 transition-colors'
                    onClick={() => eliminarDelCarrito(index)}
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. FOOTER DE ENVÍO (STICKY/FIJO) */}
        <div className="p-4 border-t bg-white shadow-lg sticky bottom-0">

          <button
            type='submit'
            data-cy="submit-pedido-btn"
            disabled={carrito.length === 0 || processing}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-lg transition-colors transform active:scale-[0.99] shadow-md
                        ${carrito.length === 0 || processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h.008v.008H5.25v-.008zM12 13.5a.75.75 0 00-.75.75v.008h.008V13.5H12z" clipRule="evenodd" />
            </svg>
            {processing ? 'Enviando...' : 'Confirmar y Enviar Pedido'}
          </button>
        </div>
      </form>
    </div >
  );
};

export default CarritoComponente;