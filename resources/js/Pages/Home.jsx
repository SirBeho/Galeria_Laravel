import { Img } from 'react-image';

import Layout from '@/Layouts/Layout';
import React, { useEffect, useState } from "react";

import { Head, useForm } from '@inertiajs/react';
import LazyLoad from 'react-lazyload';

import Modal from '@/Components/Modal';
import Loading from '@/Components/Loading';





export default function Dashboard({ nombres,user }) {


  console.log(user)
  const [images, setImageNames] = useState(Object.values(nombres));
  const [openProdutM, setOpenProdutM] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [openProdut, setOpenProdut] = useState([]);


  const [carrito, setCarrito] = useState([]);



  const setNewCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
  };

  const { data: producto, setData: setProducto, post, reset } = useForm({
    nombre: "",
    codigo: "",
    cantidad: "",
    comentario: "",
  });


  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  // Guardar datos del carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));

    setOpenProdut([])
    setOpenProdutM(false)
    reset();
  }, [carrito]);

  const agregarAlCarrito = (e) => {

    e.preventDefault();
    // setLoading(true);
    setAgregado(true);
    setCarrito([...carrito, producto]);
    // setLoading(false);

  };







  const open = (file) => {
    setOpenProdutM(true);
    setOpenProdut(file);
  }

  const subir = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }



  return (
    <Layout carrito={carrito} user={user} setNewCarrito={setNewCarrito}  >
      <Head title="Catalogo" />


      <Modal show={agregado} onClose={() => setAgregado(false)} header={"Producto Agregado"} close_x={true}>
        <div className='py-8 text-xl'>El producto se agregó correctamente </div>
        <div className="flex justify-center mt-2" >
          <button onClick={() => setAgregado(false)} type="button" className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500" >Cerrar</button>
        </div>
      </Modal>


      <div>
        <h1 className="my-4 font-bold text-4xl">
          GALERIA PRINCIPAL
        </h1>

        <Img src="/images/1.jpg" className="w-full h-96 object-cover" />

        <div className="flex gap-4 flex-wrap justify-around">
          {images.map((file, index) => {

            return (

              <div key={index} onClick={() => { open(file), setProducto({ ...producto, codigo: file }) }} style={{ boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)' }} className="  flex-[1_0_100%] sm:flex-[1_0_48%] md:flex-[1_0_30%]  flex cursor-pointer  max-h-80  relative mb-4 rounded-md overflow-hidden" >
                <LazyLoad className='w-full h-full' offset={200}>
                  <img className="h-full object-cover w-full" src={`/images/${file}`} alt="Descripción" />
                </LazyLoad>
                <img className="w-32 absolute bottom-0 left-0" src="logo.png" />
                <span className="absolute top-2 left-4 text-black bg-white rounded-2xl px-2">
                  {'--'}
                </span>
              </div>
            )
          })}
        </div>


        <Modal show={openProdutM} close_x={true} header={"Detalle del Artículo"} onClose={() => { setOpenProdutM(false) }}>
          <h1>{openProdut}</h1>
          <div className='flex justify-center bg-slate-100 p-2 rounded-md'>
            <div className="relative rounded-[0.5rem] overflow-hidden w-fit-content">
              <img id="modal-image" src={`images/${openProdut}`} className="img-fluid" alt="Imagen del artículo" />
              <img className="w-32 absolute bottom-0 left-0" src="logo.png" />
              <span id="modal-codigo" className="absolute top-10 left-16 text-black bg-white rounded-8 px-5"></span>
            </div>
          </div>

          <form onSubmit={agregarAlCarrito} className="flex gap-4 mt-4 border-2 p-3 border-black rounded-md justify-between ">
            <input type="hidden" id="scrollPosition" name="scrollPosition" />

            <div className="flex flex-col gap-2 w-full max-w-[30rem]">
              <input type="hidden" name="add_to_cart" value="1" />
              <input type="hidden" name="file" id="form-file" />
              <input type="hidden" name="codigo" id="form-codigo" />

              <label className="flex flex-col w-full">
                <span>Cantidad:</span>
                <input min={1} value={producto.cantidad} onChange={(e) => { setProducto({ ...producto, cantidad: e.target.value }) }} type="number" className="w-full border rounded-md outline-8 focus:outline-blue-300" id="cantidad" name="cantidad" required />
              </label>

              <label htmlFor="comentario" className="flex flex-col w-full">
                Comentario:
                <textarea value={producto?.comentario} onChange={(e) => { setProducto({ ...producto, comentario: e.target.value }) }} className="w-full border rounded-md outline-8 focus:outline-blue-300" id="comentario" name="comentario" rows="4"></textarea>
              </label>
            </div>

            <button type="submit" className="rounded-md bg-blue-500 text-white p-1 hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" height="3em" fill="white" viewBox="0 0 640 512">
                <path d="M64 32C28.7 32 0 60.7 0 96V304v80 16c0 44.2 35.8 80 80 80c26.2 0 49.4-12.6 64-32c14.6 19.4 37.8 32 64 32c44.2 0 80-35.8 80-80c0-5.5-.6-10.8-1.6-16H416h33.6c-1 5.2-1.6 10.5-1.6 16c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H608c17.7 0 32-14.3 32-32V288 272 261.7c0-9.2-3.2-18.2-9-25.3l-58.8-71.8c-10.6-13-26.5-20.5-43.3-20.5H480V96c0-35.3-28.7-64-64-64H64zM585 256H480V192h48.8c2.4 0 4.7 1.1 6.2 2.9L585 256zM528 368a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM176 400a32 32 0 1 1 64 0 32 32 0 1 1-64 0zM80 368a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg> <br />
              <i className="fas fa-shopping-cart"></i> Agregar
            </button>
          </form>

          <div className="flex justify-center mt-2" >
            <button type="button" className="bg-red-400 rounded-md p-2 px-3 text-white hover:bg-red-500" >Cerrar</button>
          </div>


        </Modal>

        <div className="bg-nav fixed right-2 bottom-2 rounded-full w-16 h-16 flex items-center justify-center z-20 cursor-pointer" onClick={subir}>
          <svg fill="white" className="w-8 h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M32 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96-43 96-96l0-306.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 416c0 17.7-14.3 32-32 32l-96 0z" />
          </svg>
        </div>

      </div>

    </Layout>
  );
}
