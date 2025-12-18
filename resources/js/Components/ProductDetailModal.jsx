import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ImageCarousel } from './ImageCarousel';
import { usePage } from '@inertiajs/react';

export function ProductDetailModal({
    isOpen,
    close,
    images,
    galleryUrl,
    current,
    setCurrent,
    producto,
    setProducto,
    agregarAlCarrito,
    maxWidthClass = "max-w-6xl" // Hacemos el modal ancho para escritorio
}) {

    const { secondaryColor } = usePage().props.designSettings;

    if (!isOpen) return null;

    const fullImageUrl = `${galleryUrl}${images[current]}`;

    const nextSlide = (e) => {
        e?.stopPropagation();

        if (current < images.length - 1) setCurrent(current + 1);
    };

    const previousSlide = (e) => {
        e?.stopPropagation();
        if (current > 0) setCurrent(current - 1);
    };

    const name = images[current]?.split('/').pop().split('.').slice(0, -1).join('.') || '';

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={close}>

                {/* Fondo oscuro con blur */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
                </Transition.Child>




                <div className="fixed inset-0 z-10 overflow-y-auto">

                    <div className="flex min-h-full items-center justify-center p-4 text-center ">
                        {/* Botón Cerrar Flotante (Visible en móvil) */}
                        <button onClick={close} className="absolute top-8 right-8  md:hidden  z-50 bg-white/80 p-2 rounded-full text-gray-800 shadow-md">
                            ✕
                        </button>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className={`w-full h-[95vh] ${maxWidthClass} transform overflow-auto bg-white rounded-2xl text-left align-middle shadow-2xl transition-all flex flex-col md:flex-row  md:min-h-[95vh]`}>
                                {/* Botón Cerrar Flotante */}
                                <button onClick={close} className="absolute top-3 right-4 hidden md:block z-50 bg-white/80 p-2 rounded-full text-gray-800 shadow-md">
                                    ✕
                                </button>
                                {/* IZQUIERDA: CARRUSEL (65% del ancho en PC) */}
                                <div className="relative w-full md:w-[65%] h-full min-h-[80vh] md:min-h-max md:h-auto bg-gray-50">
                                    <ImageCarousel
                                        Imagename={fullImageUrl}
                                        images={images}
                                        current={current}
                                        onNext={nextSlide}
                                        onPrev={previousSlide}
                                        isFirst={current === 0}
                                        isLast={current === images.length - 1}
                                    />

                                </div>

                                {/* DERECHA: FORMULARIO (35% del ancho en PC) */}
                                <div className="w-full md:w-[35%] flex flex-col bg-white border-l md:overflow-auto border-gray-100 md:h-full">
                                    {/* Contenido Scrollable */}
                                    <div className="flex-1 ">

                                        {/* Encabezado del Formulario */}
                                        <form id="order-form" onSubmit={agregarAlCarrito} className="flex flex-col md:gap-8  p-6 py-2 ">
                                            <div className='flex md:flex-col md:gap-8 justify-between border-b md:border-b-0 pb-2  '>
                                                <div className=" flex justify-between items-center bg-white w-fit md:w-full md:border-b md:pb-1">
                                                    <div>
                                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 md:pt-10">Preparar Pedido</h3>
                                                        <p className="text-[7px] text-gray-500">Referencia: {name} </p>
                                                    </div>

                                                </div>
                                                {/* Selector de Cantidad Grande */}
                                                <div>
                                                    <label
                                                        htmlFor='cantidad'
                                                        className="  text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                                                    <div className="flex items-center h-12 border border-gray-300 rounded-xl overflow-hidden">
                                                        <button type="button"
                                                            className="w-14  bg-gray-50 h-full hover:bg-gray-100 text-s font-bold text-gray-600 border-r transition-colors"
                                                            onClick={() => setProducto({ ...producto, cantidad: Math.max(1, parseInt(producto.cantidad) - 1) || 1 })}
                                                        >-</button>
                                                        <input
                                                            id="cantidad"
                                                            required
                                                            type="number"
                                                            min="1"
                                                            value={producto.cantidad}
                                                            onChange={(e) => setProducto({ ...producto, cantidad: e.target.value })}
                                                            className="flex-1 w-16 p-0  text-center border-none text-lg font-bold text-gray-800 focus:ring-0"
                                                        />
                                                        <button type="button"
                                                            data-cy="increment-cantidad-btn"
                                                            className="w-14  bg-gray-50 h-full hover:bg-gray-100 text-xl font-bold text-gray-600 border-l transition-colors"
                                                            onClick={() => setProducto({ ...producto, cantidad: parseInt(producto.cantidad) + 1 || 1 })}
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Comentario */}
                                            <div>
                                                <label
                                                    htmlFor="comentario"
                                                    className="block text-sm font-medium text-gray-700 mb-2">Comentario / Nota</label>
                                                <textarea
                                                    id="comentario"
                                                    data-cy="input-comentario"
                                                    rows=""
                                                    className="w-full h-11 md:h-24 focus:h-20 rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none bg-gray-50"
                                                    placeholder="Ej: Quiero una docena de este color..."
                                                    value={producto.comentario || ''}
                                                    onChange={(e) => setProducto({ ...producto, comentario: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Footer con Botón de Acción */}
                                    <div className="p-6 py-2 border-t bg-gray-50">
                                        <button
                                            data-cy="add-to-cart-btn"
                                            form="order-form"
                                            type="submit"
                                            style={{ backgroundColor: secondaryColor }}
                                            className="bg-blue-600 hover:scale-105 w-full flex justify-center items-center gap-2   text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-transform active:scale-95 text-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Agregar al Pedido
                                        </button>
                                    </div>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}