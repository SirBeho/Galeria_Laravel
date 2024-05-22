import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({children,galeria = false,show = false,maxWidth = "2xl", loading=false,closeable = true,close_x = true,header = false,onClose = () => {},}) {
    const close = () => {
        
        if (closeable && !loading) {
            setIsClosing(true);
            setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, 100);
        }
    };

    const [isClosing, setIsClosing] = useState(false);

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
                className={`${
                    show ? "" : "hidden"
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
                        
                      {galeria && (galeria) }
                        
                        <div className={`relative ${maxWidthClass} bg-white p-6 mb-6  rounded-lg shadow-xl transform transition-all sm:w-full sm:mx-auto `}>
                            {close_x && (
                                <button onClick={close} className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2" >
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