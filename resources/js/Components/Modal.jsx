import { Fragment, useEffect, useState, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { usePage } from "@inertiajs/react";

export default function Modal({ children, galeria = false, autoclose = 0, show = false, maxWidth = "2xl", loading = false, closeable = true, close_x = true, header = false, onClose = () => { }, }) {

    const {
        secondaryColor,
    } = usePage().props.designSettings;



    const close = useCallback(() => {

        if (closeable && !loading) {
            setIsClosing(true);
            setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, 100);
        }
    });

    const [isClosing, setIsClosing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(autoclose); // Estado para el tiempo restante

    useEffect(() => {
        if (show && autoclose > 0) {
            // Inicializa el tiempo restante con el valor total de autoclose
            setTimeLeft(autoclose);
            console.log('aqi')
            // 1. Configurar el autocierre (Se mantiene igual)
            const timerId = setTimeout(() => {
                close();
            }, autoclose);

            const intervalId = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    const newTimeLeft = prevTimeLeft - 50; // Restar 50ms (intervalo)
                    if (newTimeLeft <= 0) {
                        clearInterval(intervalId);
                        return 0;
                    }
                    return newTimeLeft;
                });
            }, 50);

            // 3. Limpieza
            return () => {
                clearTimeout(timerId);
                clearInterval(intervalId);
                setTimeLeft(autoclose); // Reiniciar al valor completo
            };
        } else if (!show) {
            setTimeLeft(autoclose); // Resetear al cerrarse
        }
    }, [show]); // Dependencias

    // Cálculo del progreso para la barra (basado en el tiempo restante)
    const progressPercentage = autoclose > 0
        ? (timeLeft / autoclose) * 100
        : 0;

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-100">
            <Dialog
                as="div"
                id="modal"
                className={`${show ? "" : "hidden"
                    } fixed bg-black/50 inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-start justify-center z-30 transform transition-all`}
                onClose={close}
            >
                {/*  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 " />
                </Transition.Child>  */}

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel onClick={close} className={` w-full  ${isClosing ? "modal-close" : "modal-open"}`}>

                        {galeria && (galeria)}

                        <div onClick={(e) => e.stopPropagation()} className={`relative ${maxWidthClass} o bg-white p-6 mb-6  rounded-lg shadow-xl transform transition-all sm:w-full sm:mx-auto `}>

                            {autoclose > 0 && (
                                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg overflow-hidden">
                                    <div
                                        style={{ backgroundColor: secondaryColor, width: `${progressPercentage}%` }}

                                        className="h-full bg-blue-500 transition-all duration-50"
                                    // Usamos progressPercentage para que la barra vaya DECRECIENDO (desde 100% hasta 0%)

                                    ></div>
                                </div>
                            )}


                            {close_x && (
                                <button data-cy="modal-close-btn"
                                    onClick={close} className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2" >
                                    x
                                </button>
                            )}

                            {header && (
                                <h5 className="text-xl font-bold text-center pb-2">
                                    {header}
                                </h5>
                            )}
                            {children}{" "}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}