import React, { useState, useEffect } from "react";
import Layout from "@/Layouts/Layout";
import { Head, useForm } from "@inertiajs/react";
import { format, parseISO } from "date-fns";
import Modal from '@/Components/Modal';
import Loading from "@/Components/Loading";



export default function Subir({ user ,mensaje }) {
   
    const { data, setData, post, processing, errors, reset } = useForm([]);
    const [loading, setLoading] = useState(false);

    const [images, setImages] = useState([]);

    const [msj, setMsj] = useState(mensaje);

    useEffect(() => {   
        setMsj(mensaje);


    }, [mensaje]);

   
     


    const handleImageChange = (e) => {
        // Obtener los archivos seleccionados
        const files = Array.from(e.target.files);
        // Filtrar los archivos seleccionados para excluir los duplicados
        const uniqueFiles = files.filter(file => !data.some(image => image.name === file.name));
        // Actualizar el estado con las nuevas imágenes
        setData([...data,...uniqueFiles]);

        const imageList = uniqueFiles.map((file) => ({
            file,
            previewURL: URL.createObjectURL(file),
          }));
          setImages([ ...images,...imageList]);
      };
      

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('subir.imagen'), {
            onSuccess: () => {
                reset();
                setData([]);
                setImages([]);
                setLoading(false);
            },
        });

        
    };

    // Resto de tu código aquí...

    return (
        <Layout carrito={{}} setNewCarrito={null} user={user}>
            <Head title="Pedido" />

            <Loading show={loading} />

            <Modal show={msj != null} onClose={() => setMsj(null)} header={"Producto Agregado"} close_x={true}>
       {msj?.success  && <div className="text-center text-green-600 text-xl" >
          <p>{msj.success }</p>
        </div>}

        {msj?.errors  && <div className="text-center text-red-500 mt-4 text-sm">
            {msj.errors.map((error, index) => (
                <span className="block" key={index}>{error}</span>
            ))}
        </div>}

        <div className="flex justify-center mt-2" >
          <button onClick={() => setMsj(null)} type="button" className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500" >Cerrar</button>
        </div>
      </Modal>


            <h1 className="pt-4 my-4 font-bold text-4xl">Subir Imagenes</h1>

            <div className="p-2 pt-8">
         <div className="flex gap-4  ">
                <label
                    htmlFor="fileInput"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                    Cargar Imagenes
                </label>
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    multiple
                    accept="image/*"
                     
                    onChange={handleImageChange}
                />

                <span className="content-center">{data.length} archivos pre cargados</span>
                </div>
                <div className="flex flex-wrap mt-4 gap-3">
                    {images?.map((image, index) => (
                        <div key={index} className="relative w-32 h-32 ">
                            <img
                                src={image.previewURL}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover rounded"
                            />
                            <svg
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newImages = images.filter(
                                        (img, i) =>
                                            image.file.name !== img.file.name
                                    );
                                    setImages(newImages);

                                    const newData = data.filter(
                                        (img, i) =>
                                            image.file.name !== img.name
                                    );
                                    setData(newData);
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="cursor-pointer z-10 fill-blue-600 absolute bottom-1 right-1 text-white h-6 w-6 hover:fill-red-600 rounded-md hover:scale-110"
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
                        </div>
                    ))}
                </div>
                {data.length != 0&&
                <div className="flex justify-center">
                <button
                    onClick={handleFormSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mt-4"
                >
                    Guardar Imágenes
                </button> </div>}

            </div>

            {/* Resto de tu código... */}
        </Layout>
    );
}
