import Layout from "@/Layouts/Layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react"; // Agregué useEffect por si acaso

// Contextos
import { useCarrito } from '@/Contexts/CarritoContext';
import { useVisual } from '@/Contexts/VisualContext';
import { CarritoProvider } from '@/Contexts/CarritoContext'; // Para el layout
import { VisualProvider } from '@/Contexts/VisualContext';   // Para el layout

// Componentes
import Modal from "@/Components/Modal";
import Loading from "@/Components/Loading";
import LazyLoadedImage from "@/Components/LazyLoadedImage";
import { ProductDetailModal } from '@/Components/ProductDetailModal';


export default function Home({ imgHome, imgJuegos }) {

    // --- CONTEXTOS ---
    const { agregarAlCarrito: contextAgregarAlCarrito } = useCarrito();
    const { verJuegos, estadoVisual, showEliminar, toggleDeleteMode } = useVisual();
    const { logoUrl, primaryColor, secondaryColor } = usePage().props.designSettings;

    // --- IMÁGENES ---
    const images = verJuegos ? Object.values(imgJuegos) : Object.values(imgHome || []);

    // --- ESTADOS LOCALES ---
    const [openProdutM, setOpenProdutM] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agregado, setAgregado] = useState(false);
    const [msj, setMsj] = useState(null);

    // 🟢 Estado local para la SELECCIÓN de archivos (esto vive solo en Home)
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [current, setCurrent] = useState(0);
    const imageRefs = useRef([]);

    // Formulario para agregar producto
    const { data: producto, setData: setProducto, reset } = useForm({
        codigo: "", cantidad: 1, comentario: ""
    });

    // Formulario para eliminar (API Delete)
    const { post: postDelete } = useForm({});

    // --- EFECTOS ---
    // Limpiar selección si se desactiva el modo eliminar desde el Navbar
    useEffect(() => {
        if (!showEliminar) {
            setSelectedFiles([]);
        }
    }, [showEliminar]);

    // --- LOGICA UI ---
    const StrollTo = () => {
        setTimeout(() => {
            if (imageRefs.current[current]) {
                imageRefs.current[current].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const subir = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const close = () => {
        reset();
        setOpenProdutM(false);
        StrollTo();
    };

    const open = (file, index) => {
        // Solo abrimos el modal si NO estamos en modo eliminar
        if (!showEliminar) {
            setCurrent(index);
            setOpenProdutM(true);
            setProducto({ codigo: file, cantidad: 1, comentario: "" });
        }
    };

    const handleAgregarAlCarrito = (e) => {
        e.preventDefault();
        contextAgregarAlCarrito(producto);
        close();
        setAgregado(true);
    };

    // --- LOGICA DE ELIMINACIÓN ---

    const toggleSelection = (e, filename) => {
        e.stopPropagation(); // Evita abrir el modal
        setSelectedFiles(prev =>
            prev.includes(filename) ? prev.filter(n => n !== filename) : [...prev, filename]
        );
    };

    const handleDeleteSelected = (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setLoading(true);
        setShowConfirmModal(false);

        postDelete(route("eliminar.imagen", { codigos: selectedFiles }), {
            onSuccess: (response) => {
                setMsj(response.props.mensaje);
                setSelectedFiles([]);
                setLoading(false);
                toggleDeleteMode();
            },
            onError: (err) => {
                console.error(err);
                setLoading(false);
                alert("Error al eliminar archivos.");
            },
        });
    };

    // --- RENDER ---
    return (
        <>
            <Head title="Home" />

            {/* --- MODALES --- */}
            <Modal show={agregado} autoclose={3000} onClose={() => setAgregado(false)} header="Producto Agregado" close_x={true}>
                <div className="py-8 text-xl text-center">El producto se agregó correctamente</div>
                <div className="flex justify-center mt-2">
                    <button onClick={() => setAgregado(false)} data-cy="modal-added-close-btn" className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500">Cerrar</button>
                </div>
            </Modal>

            {/* 🟢 Modal Confirmar Eliminación */}
            <Modal loading={loading} show={showConfirmModal} onClose={() => setShowConfirmModal(false)} header={`Confirmar Eliminación (${selectedFiles.length} Archivos)`} close_x={true}>
                <div className="py-4 flex flex-col items-center">
                    <h3 className="text-xl mb-4 font-semibold text-center">¿Seguro que desea eliminar estas imágenes?</h3>
                    <div className="flex flex-wrap justify-center gap-2 p-3 bg-gray-100 max-h-60 overflow-y-auto rounded-md w-full">
                        {selectedFiles.map((f) => (
                            <div key={f} className="w-20 h-20 overflow-hidden rounded-md shadow-md border relative">
                                <img className="h-full object-cover w-full" src={`/images/${f}`} alt={f} />
                                {/* <span className="absolute bottom-0 w-full bg-black/50 text-white text-xs text-center truncate">
                                    {f}
                                </span> */}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center mt-4 gap-4">
                    <button onClick={() => setShowConfirmModal(false)} className="bg-gray-400 rounded-md px-3 py-2 text-white hover:bg-gray-500">Cancelar</button>
                    <button onClick={handleDeleteSelected} className="bg-red-500 rounded-md px-3 py-2 text-white hover:bg-red-700">Eliminar ({selectedFiles.length})</button>
                </div>
            </Modal>

            <Modal show={msj != null} onClose={() => setMsj(null)} header={"Productos Eliminados"} close_x={true}>
                {msj?.success && <div className="text-center text-green-600 text-xl" >
                    <p>{msj.message}</p>
                </div>}

                {msj?.errors && <div className="text-center text-red-500 mt-4 text-sm">
                    {msj.errors.map((error, index) => (
                        <span className="block" key={index}>{error}</span>
                    ))}
                </div>}

                <div className="flex justify-center mt-2" >
                    <button onClick={() => setMsj(null)} type="button" className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500" >Cerrar</button>
                </div>
            </Modal>

            {/* 🟢 Botón Flotante Eliminar (Solo visible si hay seleccionados) */}
            {showEliminar && !showConfirmModal && selectedFiles.length > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
                    <button onClick={() => setShowConfirmModal(true)} className="flex items-center px-4 h-14 bg-red-600 rounded-full text-white shadow-xl hover:bg-red-700 hover:scale-105 transition">
                        <span>Eliminar</span>
                        <span className="ml-2 bg-blue-500 rounded-full px-2 py-0.5 text-xs font-bold">{selectedFiles.length}</span>
                    </button>
                </div>
            )}

            {/* --- GALERÍA PRINCIPAL --- */}
            <div>
                <h1 className="my-6 font-bold text-4xl text-center">
                    {verJuegos ? "JUGUETES" : "GALERIA PRINCIPAL"}
                </h1>

                <div className="flex gap-4 flex-wrap justify-around">
                    {images.map((file, index) => (
                        <button
                            ref={(el) => (imageRefs.current[index] = el)}
                            key={index}
                            data-cy={`gallery-item`}
                            // 🟢 Condicional de click: Si showEliminar es true, selecciona. Si no, abre modal.
                            onClick={showEliminar ? (e) => toggleSelection(e, file) : () => open(file, index)}
                            style={{ boxShadow: "5px 5px 10px rgba(0,0,0,0.5)" }}
                            className={`
                                ${estadoVisual === 0 ? "flex-[1_0_100%] min-[580px]:flex-[1_0_48%] min-[900px]:flex-[1_0_30%]" : estadoVisual === 1 ? "flex-[1_0_48%]" : "flex-[1_0_100%]"}
                                ${selectedFiles.includes(file) ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
                                flex cursor-pointer max-h-80 h-80 relative mb-4 rounded-md overflow-hidden transition-all
                            `}
                        >
                            <LazyLoadedImage file={file} />
                            <img className="w-32 absolute bottom-0 left-0" src="logo.png" alt="Logo" />
                            <span className="absolute top-2 left-4 text-black bg-white rounded-2xl px-2">--</span>

                            {/* 🟢 Indicador Visual de Selección (Checkbox/Círculo) */}
                            {showEliminar && (
                                <button onClick={(e) => toggleSelection(e, file)} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg z-10">
                                    {selectedFiles.includes(file) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.882l-3.484 4.148-1.88-1.88a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.25Z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-500"><circle cx="12" cy="12" r="10" /></svg>
                                    )}
                                </button>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <ProductDetailModal
                isOpen={openProdutM}
                close={close}
                images={images}
                current={current}
                setCurrent={(idx) => {
                    setCurrent(idx);
                    setProducto({ ...producto, codigo: images[idx], cantidad: 1, comentario: "" });
                }}
                producto={producto}
                setProducto={setProducto}
                agregarAlCarrito={handleAgregarAlCarrito}
            />

            <Loading maxWidth='sm' show={loading} />

            <button style={{ backgroundColor: secondaryColor }} className="bg-nav fixed right-2 bottom-2 rounded-full w-16 h-16 flex items-center justify-center z-20 cursor-pointer" onClick={subir}>
                <svg fill="white" className="w-8 h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M32 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96-43 96-96l0-306.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 416c0 17.7-14.3 32-32 32l-96 0z" /></svg>
            </button >
        </>
    );
}

// 🟢 LAYOUT CON DOBLE PROVIDER
Home.layout = (page) => (
    <CarritoProvider>
        <VisualProvider>
            <Layout user={page.props.user}>
                {page}
            </Layout>
        </VisualProvider>
    </CarritoProvider>
);