import { Img } from "react-image";
import Layout from "@/Layouts/Layout";
import { Head, useForm } from "@inertiajs/react";
import LazyLoad from "react-lazyload";
import Modal from "@/Components/Modal";
import Loading from "@/Components/Loading";
import { set } from "date-fns";
import React, {
    Children,
    Fragment,
    act,
    useEffect,
    useRef,
    useState,
} from "react";
import ReactDOM from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import { chip } from "@material-tailwind/react";

export default function Dashboard({ nombres, user }) {
    const [images, setImageNames] = useState(Object.values(nombres));
    const [openProdutM, setOpenProdutM] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agregado, setAgregado] = useState(false);
    const [showEliminar, setShowEliminar] = useState(false);
    const [eliminarConfirmar, setEliminarConfirmar] = useState("");
    const [openProdut, setOpenProdut] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [current, setCurrent] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const Padre = useRef(null);
    const imageRefs = useRef([]);

    const {
      data: producto,
      setData: setProducto,
      reset,
  } = useForm({
      nombre: "",
      codigo: "",
      cantidad: "",
      comentario: "",
  });

    const close = () => {
        console.log('pre Cerrando')
        if (!loading){
            console.log('Cerrando')
            if (imageRefs.current[current]) {
                imageRefs.current[current].scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }
            setIsClosing(true);
            setTimeout(() => {
                setOpenProdutM(false);
                setIsClosing(false);
            }, 100);
        }
    };

    const previousSlide = (e) => {
        e.stopPropagation();
        const Actual = document.getElementById(current);

        if (current != 0 && Actual) {
            console.log("clickAnterior2")
            Actual.firstChild.classList.add("translate-x-full");
            Actual.firstChild.classList.add("scale-75");
            Actual.firstChild.classList.add("opacity-0");
            Actual.lastChild.classList.add("absolute");
            setCurrent(current - 1);

            const tempContainer = document.createElement("div");
            ReactDOM.render(Anterior(current - 1), tempContainer);
            const newDiv = tempContainer.firstChild;
            newDiv.firstChild.querySelector("button").addEventListener("click", close);
            Padre.current.appendChild(newDiv);

            setTimeout(() => {
                newDiv.firstChild.classList.remove("scale-75");
                newDiv.firstChild.classList.remove("opacity-0");
                newDiv.firstChild.classList.add("translate-x-1/2");
            }, 10);

            setTimeout(() => {
                if (Padre?.current?.children?.length > 1) {
                    Padre.current.children[0].remove();
                }
            }, 500);
        }
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        const Actual = document.getElementById(current);

        if (current != images.length - 1 && Actual) {
            Actual.firstChild.classList.remove("translate-x-1/2");
            Actual.firstChild.classList.add("scale-75");
            Actual.firstChild.classList.add("opacity-0");
            Actual.lastChild.classList.add("absolute");
            setCurrent(current + 1);

            const tempContainer = document.createElement("div");
            ReactDOM.render(Siguiente(current + 1), tempContainer);
            const newDiv = tempContainer.firstChild;
            
            newDiv.firstChild.querySelector("button").addEventListener("click", close);
            Padre.current.appendChild(newDiv);

            setTimeout(() => {
                newDiv.firstChild.classList.remove("translate-x-full");
                newDiv.firstChild.classList.remove("scale-75");
                newDiv.firstChild.classList.remove("opacity-0");
                newDiv.firstChild.classList.add("translate-x-1/2");
            }, 10);

            setTimeout(() => {
                 if (Padre?.current?.children?.length > 1) {
                    Padre.current.children[0].remove();
                } 
            }, 500);
        }
    };

    useEffect(() => {
        
        setOpenProdut(images[current]);
    }, [current]);

    const open = (file, index) => {
        
        setCurrent(index);
        setOpenProdutM(true);
        setOpenProdut(file);
        setProducto({ ...producto, codigo: file });
    };

    const setNewCarrito = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
    };


    const { data, setData, post, reset: restt } = useForm({});

    //post para eliminar una foto

    const eliminar = (e, codigo) => {
        e.preventDefault();
        setLoading(true);
        post(route("eliminar.imagen", { codigo: codigo }), {
            onSuccess: () => {
                if (images.includes(codigo)) {
                    setImageNames(images.filter((item) => item != codigo));
                    setEliminarConfirmar(null);
                    setLoading(false);
                }
            },
        });
    };

    useEffect(() => {
        const carritoGuardado =
            JSON.parse(localStorage.getItem("carrito")) || [];
        setCarrito(carritoGuardado);
    }, []);

    // Guardar datos del carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));

        setOpenProdut([]);
        setOpenProdutM(false);
        reset();
    }, [carrito]);

    const agregarAlCarrito = (e) => {
        e.preventDefault();
        // setLoading(true);
        setAgregado(true);
        setCarrito([...carrito, producto]);
        // setLoading(false);
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }["2xl"];

    const subir = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

   

    const Siguiente = (index) => {
      
        return (
            <div id={index}>
            <div
                className={`${maxWidthClass} bg-white absolute z-10 top-0 right-1/2 translate-x-full scale-75 opacity-0 p-6 rounded-lg shadow-xl transform transition-all duration-300 w-full mx-auto`}
            >
                <button
                    onClick={() => close()}
                    className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2"
                >
                    x
                </button>
                <h1 className="absolute left-9 top-16  text-white" style={{
                    filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 1))",
                }}>{images[index]}</h1>

                <h5 className="text-xl font-bold text-center pb-2">
                    Detalle del Artículo
                </h5>

                <div className="overflow-hidden rounded-3xl shadow-xl">
                    <div className="flex  h-full bg-white w-full transition ease-out duration-40">
                        <div className="block min-w-full w-full overflow-hidden">
                            <div className="w-full h-full rounded-sm overflow-hidden ">
                                <img
                                    className="h-full object-cover w-full"
                                    src={`/images/${images[index]}`}
                                    alt="Descripción"
                                />
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
            <div className={`${maxWidthClass} bg-white  scale-75 opacity-0 p-6  rounded-lg shadow-xl transform transition-all duration-300 sm:w-full sm:mx-auto`}>
                
                <h5 className="text-xl font-bold text-center pb-2">Detalle del Artículo</h5>
                
                <div className="overflow-hidden">
                    <div className="flex h-full bg-white w-full transition ease-out duration-40">
                        <div className="block min-w-full w-full rounded-3xl overflow-hidden">
                            <div className="w-full h-full">
                                <img
                                    className="h-full object-contain w-full"
                                    src={`/images/${images[index]}`}
                                    alt="Descripción"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    };
    const Anterior = (index) => {
        return (
            <div id={index}>
            <div
                className={`${maxWidthClass} bg-white absolute right-1/2  scale-75 opacity-0 p-6  rounded-lg shadow-xl transform transition-all duration-300 w-full mx-auto`}
            >
                <button
                    onClick={close}
                    className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2"
                >
                    x
                </button>

                <h1 className="absolute left-9 top-16  text-white" style={{
                    filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 1))",
                }}>{images[index]}</h1>

                <h5 className="text-xl font-bold text-center pb-2">
                    Detalle del Artículo
                </h5>

                <div className="overflow-hidden rounded-3xl shadow-xl">
                    <div className="flex  h-full bg-white w-full transition ease-out duration-40">
                        <div className="block min-w-full w-full overflow-hidden">
                            <div className="w-full h-full rounded-sm overflow-hidden ">
                                <img
                                    className="h-full object-cover w-full"
                                    src={`/images/${images[index]}`}
                                    alt="Descripción"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className={`${maxWidthClass} bg-white  scale-75 opacity-0 p-6  rounded-lg shadow-xl transform transition-all duration-300 sm:w-full sm:mx-auto`}>
                
                <h5 className="text-xl font-bold text-center pb-2">Detalle del Artículo</h5>
                
                <div className="overflow-hidden">
                    <div className="flex h-full bg-white w-full transition ease-out duration-40">
                        <div className="block min-w-full w-full rounded-3xl overflow-hidden">
                            <div className="w-full h-full">
                                <img
                                    className="h-full object-contain w-full"
                                    src={`/images/${images[index]}`}
                                    alt="Descripción"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    };

    return (
        <Layout
            carrito={carrito}
            user={user}
            setNewCarrito={setNewCarrito}
            eliminar={showEliminar}
            mostrar={() => setShowEliminar(!showEliminar)}
        >
            <Head title="Catalogo" />

            <Modal
                loading={loading}
                show={agregado}
                onClose={() => setAgregado(false)}
                header={"Producto Agregado"}
                close_x={true}
            >
                <div className="py-8 text-xl">
                    El producto se agregó correctamente{" "}
                </div>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={() => setAgregado(false)}
                        type="button"
                        className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500"
                    >
                        Cerrar
                    </button>
                </div>
            </Modal>

            <Modal
                 loading={loading}
                show={eliminarConfirmar != null && eliminarConfirmar != ""}
                onClose={() => setEliminarConfirmar(null)}
                header={"Eliminar Agregado"}
                close_x={true}
            >
                <div className="py-8 text-2xl flex gap-4 ">
                    <div className="w-36 h-36 overflow-hidden rounded-md">
                        <img
                            className="h-full object-cover w-full"
                            src={`/images/${eliminarConfirmar}`}
                            alt="prudcto"
                        />
                    </div>
                    <span className="content-center">
                        {" "}
                        Seguro que quieres eliminar {eliminarConfirmar}
                    </span>
                </div>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={(e) => eliminar(e, eliminarConfirmar)}
                        type="button"
                        className="bg-red-500 rounded-md p-2 px-3 text-white hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>

            <div>
                <h1 className="my-4 font-bold text-4xl">GALERIA PRINCIPAL</h1>

               

                <div className="flex gap-4 flex-wrap justify-around">
                    {images.map((file, index) => {
                        return (
                            <div
                                ref={(element) => (imageRefs.current[index] = element)}
                                key={index}
                                onClick={() => open(file, index)}
                                style={{
                                    boxShadow:
                                        "5px 5px 10px rgba(0, 0, 0, 0.5)",
                                }}
                                className="  flex-[1_0_100%] min-[580px]:flex-[1_0_48%]  min-[900px]:flex-[1_0_30%]  flex cursor-pointer  max-h-80 h-80  relative mb-4 rounded-md overflow-hidden"
                            >
                                <LazyLoad
                                    className="w-full h-full"
                                    offset={200}
                                >
                                    <img
                                        className="h-full object-cover w-full"
                                        src={`/images/${file}`}
                                        alt="Descripción"
                                    />
                                </LazyLoad>
                                <img
                                    className="w-32 absolute bottom-0 left-0"
                                    src="logo.png"
                                />
                                <span className="absolute top-2 left-4 text-black bg-white rounded-2xl px-2">
                                    {"--"}
                                </span>
                                {showEliminar && (
                                    <svg
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEliminarConfirmar(file);
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="z-10 fill-blue-600 absolute top-2 right-3 text-white h-10 w-10 hover:fill-red-600 rounded-md hover:scale-110"
                                        id="delete"
                                        style={{
                                            filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))",
                                        }}
                                    >
                                        <path
                                            className=""
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Transition
                    show={openProdutM}
                    as={Fragment}
                    leave="duration-100"
                   
                >
                    <Dialog
                        as="div"
                        id="modal"
                        className={`${
                            openProdutM ? "" : "hidden"
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
                            <Dialog.Panel
                            onClick={close}
                                className={` w-full h-fit  ${
                                    isClosing ? "modal-close" : "modal-open"
                                }`}
                            >
                                <button
                                    onClick={(e) => previousSlide(e)}
                                    className="sticky left-0 top-1/2 ms-2 z-50 text-white p-1 rounded-full hover:bg-blue-700 cursor-pointer"
                                >
                                    <svg
                                        className="h-20 w-20  fill-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512"
                                        style={{
                                            filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))",
                                        }}
                                    >
                                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => nextSlide(e)}
                                    className="sticky left-full top-1/2 me-2 z-50  text-white p-1 rounded-full hover:bg-blue-700 cursor-pointer "
                                >
                                    <svg
                                        className="h-20 w-20  fill-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512"
                                        style={{
                                            filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))",
                                        }}
                                    >
                                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                                    </svg>
                                </button>
                               <div className="flex flex-col gap-2 place-items-center ">

                                  <div ref={Padre} onClick={(e) => e.stopPropagation()}  className={`relative -mt-20 h-full   w-full ${maxWidthClass}`}>
                                    <div id={current} >
                                        <div className={`${maxWidthClass} z-10 h-full bg-white absolute right-1/2 translate-x-1/2  p-6   rounded-lg shadow-xl transform transition-all duration-1000 w-full mx-auto `}>
                                            <button
                                              onClick={close}
                                              className="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2"
                                          >
                                              x
                                          </button>

                                          <h1 className="absolute left-9 top-16  text-white" style={{
                                            filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 1))",
                                        }}>{images[current]}</h1>

                                          <h5 className="text-xl font-bold text-center pb-2">
                                              Detalle del Artículo
                                          </h5>

                                          <div className="overflow-hidden rounded-3xl shadow-md">
                                            <div className="flex  h-full bg-white w-full transition ease-out duration-40">
                                                <div className="block min-w-full w-full overflow-hidden">
                                                    <div className="w-full h-full rounded-sm overflow-hidden ">
                                                        <img
                                                            className="h-full object-cover w-full"
                                                            src={`/images/${images[current]}`}
                                                            alt="Descripción"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                        <div className={`${maxWidthClass} z-0  h-full bg-white opacity-0  p-6   rounded-lg shadow-xl transform transition-all duration-1000 sm:w-full sm:mx-auto `}>
                                                                                

                                          <h5 className="text-xl font-bold text-center pb-2">
                                              Detalle del Artículo
                                          </h5>

                                          <div className=" overflow-hidden">
                                            <div className="flex  h-full bg-white w-full transition ease-out duration-40">
                                                <div className="block min-w-full w-full rounded-3xl overflow-hidden">
                                                    <div className="w-full h-full">
                                                        <img
                                                            className="h-full object-contain w-full"
                                                            src={`/images/${images[current]}`}
                                                            alt="Descripción"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                    </div>
                                     
                                  </div>

                                  <div onClick={(e) => e.stopPropagation()}  className={`w-full ${maxWidthClass} bg-white p-3 border-black rounded-md`}>
                                
                                        <form
                                            onSubmit={agregarAlCarrito}
                                            className="flex gap-4 mt-4   justify-between "
                                        >
                                            <input
                                                type="hidden"
                                                id="scrollPosition"
                                                name="scrollPosition"
                                            />

                                            <div className="flex flex-col gap-2 w-full max-w-[30rem]">
                                                <input type="hidden" name="add_to_cart" value="1" />
                                                <input type="hidden" name="file" id="form-file" />
                                                <input type="hidden" name="codigo" id="form-codigo" />

                                                <label className="flex flex-col w-full">
                                                    <span>Cantidad:</span>
                                                    <input
                                                        min={1}
                                                        value={producto.cantidad}
                                                        onChange={(e) => {
                                                            setProducto({
                                                                ...producto,
                                                                cantidad: e.target.value,
                                                            });
                                                        }}
                                                        type="number"
                                                        className="w-full border rounded-md outline-8 focus:outline-blue-300"
                                                        id="cantidad"
                                                        name="cantidad"
                                                        required
                                                    />
                                                </label>

                                                <label
                                                    htmlFor="comentario"
                                                    className="flex flex-col w-full"
                                                >
                                                    Comentario:
                                                    <textarea
                                                        value={producto?.comentario}
                                                        onChange={(e) => {
                                                            setProducto({
                                                                ...producto,
                                                                comentario: e.target.value,
                                                            });
                                                        }}
                                                        className="w-full border rounded-md outline-8 focus:outline-blue-300"
                                                        id="comentario"
                                                        name="comentario"
                                                        rows="4"
                                                    ></textarea>
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="rounded-md bg-blue-500 text-white p-1 hover:bg-blue-700"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="3em"
                                                    fill="white"
                                                    viewBox="0 0 640 512"
                                                >
                                                    <path d="M64 32C28.7 32 0 60.7 0 96V304v80 16c0 44.2 35.8 80 80 80c26.2 0 49.4-12.6 64-32c14.6 19.4 37.8 32 64 32c44.2 0 80-35.8 80-80c0-5.5-.6-10.8-1.6-16H416h33.6c-1 5.2-1.6 10.5-1.6 16c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H608c17.7 0 32-14.3 32-32V288 272 261.7c0-9.2-3.2-18.2-9-25.3l-58.8-71.8c-10.6-13-26.5-20.5-43.3-20.5H480V96c0-35.3-28.7-64-64-64H64zM585 256H480V192h48.8c2.4 0 4.7 1.1 6.2 2.9L585 256zM528 368a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM176 400a32 32 0 1 1 64 0 32 32 0 1 1-64 0zM80 368a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                                </svg>{" "}
                                                <br />
                                                <i className="fas fa-shopping-cart"></i> Agregar
                                            </button>
                                        </form>

                                        <div onClick={close} className="flex justify-center mt-2">
                                            <button
                                                type="button"
                                                className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500"
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                  </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </Dialog>
                </Transition>

                <Loading  maxWidth='sm' show={loading} />
               
                <div
                    className="bg-nav fixed right-2 bottom-2 rounded-full w-16 h-16 flex items-center justify-center z-20 cursor-pointer"
                    onClick={subir}
                >
                    <svg
                        fill="white"
                        className="w-8 h-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                    >
                        <path d="M32 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96-43 96-96l0-306.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 416c0 17.7-14.3 32-32 32l-96 0z" />
                    </svg>
                </div>
            </div>
        </Layout>
    );
}
