import { Fragment, act, useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import { Dialog, Transition } from "@headlessui/react";
import { set } from "date-fns";
import { chip } from "@material-tailwind/react";

export default function Modal({ children,images = [],base,currenIndex = 0,setCurrenIndex ,show = false,maxWidth = "2xl",header = false,onClose = () => {},}) {
    
    const Padre = useRef(null);
    const [isClosing, setIsClosing] = useState(false);

    const close = () => {
        
       
            setIsClosing(true);
            setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, 100);
        
    };


    const previousSlide = (e) => {
        
        e.stopPropagation();
        const Actual = document.getElementById(currenIndex);
        if (currenIndex != 0 && Actual) {
            Actual.classList.add("translate-x-full");
            Actual.classList.add("scale-75");
            Actual.classList.add("opacity-0");
            setCurrenIndex(currenIndex - 1);

            const tempContainer = document.createElement('div');
            ReactDOM.render(Anterior(currenIndex - 1), tempContainer);
            const newDiv = tempContainer.firstChild;
            newDiv.querySelector('button').addEventListener('click', close);
            Padre.current.appendChild(newDiv);
            
            setTimeout(() => {
                newDiv.classList.remove('scale-75');
                newDiv.classList.remove('opacity-0');
                newDiv.classList.add('translate-x-1/2');
            }, 10); 

            setTimeout(() => {
                if (Padre?.current?.children?.length > 1) {    
                    Padre.current.children[0].remove();
                }
            }, 1000); 
        }
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        const Actual = document.getElementById(currenIndex);
    
        if (currenIndex != images.length-1 && Actual) {
            Actual.classList.remove("translate-x-1/2");
            Actual.classList.add("scale-75");
            Actual.classList.add("opacity-0");
            setCurrenIndex(currenIndex + 1);

            const tempContainer = document.createElement('div');
            ReactDOM.render(Siguiente(currenIndex + 1), tempContainer);
            const newDiv = tempContainer.firstChild;
            newDiv.querySelector('button').addEventListener('click', close);
            Padre.current.appendChild(newDiv);
       
            setTimeout(() => {
                newDiv.classList.remove('translate-x-full');
                newDiv.classList.remove('scale-75');
                newDiv.classList.remove('opacity-0');
                newDiv.classList.add('translate-x-1/2');
            }, 10); 

            setTimeout(() => {
                
                if (Padre?.current?.children?.length > 1) {    
                    Padre.current.children[0].remove();
                }
            }, 1000); 
        }
    };

    const Siguiente = (index) => {
        return (
            <div id={index} className={`${maxWidthClass} bg-white absolute right-1/2 translate-x-full scale-75 opacity-0 p-6 mb-6 rounded-lg shadow-xl transform transition-all duration-300 sm:w-full sm:mx-auto`}>
                <button onClick={() => close()} className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2" >x</button>
                <h5 className="text-xl font-bold text-center pb-2">{header}</h5>
                <h1>{images[index]}</h1>
                <div className="border overflow-hidden">
                    <div className="flex max-h-screen h-full bg-white w-full transition ease-out duration-40">
                        <div className="block min-w-full w-full rounded-3xl overflow-hidden">
                            <div className="w-full h-full">
                                <img className="h-full object-contain w-full" src={`/images/${images[index]}`} alt="Descripción" />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    };
    const Anterior = (index) => {
        return (
            <div id={index} className={`${maxWidthClass} bg-white absolute right-1/2  scale-75 opacity-0 p-6 mb-6 rounded-lg shadow-xl transform transition-all duration-300 sm:w-full sm:mx-auto`}>
                <button onClick={close} className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2">x</button>
        <h5 className="text-xl font-bold text-center pb-2">${header}</h5>
        <h1>{images[index]}</h1>
        <div className="border overflow-hidden">
            <div className="flex max-h-screen h-full bg-white w-full transition ease-out duration-40">
            <div className="block min-w-full w-full rounded-3xl overflow-hidden">
                <div className="w-full h-full">
                <img className="h-full object-contain w-full" src={`/images/${images[index]}`} alt="Descripción" />
                </div>
            </div>
            </div>
            {base}
        </div>
        </div>
        );
    };

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
            
                <Transition.Child
                
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel  className={` w-full   ${isClosing ? "modal-close" : "modal-open"}`}>
                        
                    <button onClick={(e) => previousSlide(e)}    className="sticky left-0 top-1/2 ms-2 z-50 text-white p-1 rounded-full hover:bg-blue-700 cursor-pointer">
                        <svg className='h-20 w-20  fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
                    </button>
                    <button onClick={ (e) =>  nextSlide(e)}     className="sticky left-full top-1/2 me-2 z-50  text-white p-1 rounded-full hover:bg-blue-700 cursor-pointer ">
                        <svg className='h-20 w-20  fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                    </button>              
                                  
                    <div ref={Padre} className=" relative h-screen">
                        <div id={currenIndex} className={`${maxWidthClass} bg-white absolute right-1/2 translate-x-1/2  p-6   rounded-lg shadow-xl transform transition-all duration-1000 sm:w-full sm:mx-auto `}>
                           
                                <button onClick={close} className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2" >
                                    x
                                </button>
                          

                                <h5 className="text-xl font-bold text-center pb-2">
                                    {header}
                                </h5>
                       

                            <h1>{images[currenIndex]}</h1>
                            
                            <div className="border overflow-hidden ">
                            <div className="flex  max-h-screen h-full bg-white w-full transition ease-out duration-40" >
                               
                                    <div  className=" block min-w-full w-full rounded-3xl overflow-hidden" >
                                    <div className='w-full h-full'>
                                        <img className="h-full object-contain w-full" src={`/images/${images[currenIndex]}`} alt="Descripción" />
                                    </div>
                                    </div>
                               
                                
                            </div>
                            </div>
                            {children}

                        </div>
                        
                    </div>

                    


                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}