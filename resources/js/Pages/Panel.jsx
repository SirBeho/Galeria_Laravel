import { Img } from 'react-image';
import Layout from '@/Layouts/Layout';
import React, { useEffect, useState } from "react";
import { Head, useForm } from '@inertiajs/react';
import { DataTable } from '@/Components/DataTable';
import { format, parseISO } from 'date-fns';





export default function Panel({ pedidos, user }) {


  /*   window.addEventListener('popstate', function (event) {
      // El evento popstate se dispara cuando se utiliza el botón de retroceso en el navegador
      console.log('Botón de retroceso utilizado');
  
    }); */


  pedidos.forEach(function (objeto) {

    objeto.cantidad = objeto.detalle.length;

    objeto.fecha2 = format(parseISO(objeto.fecha), 'dd/MM/yyyy').toString();
  });




  const [openProdutM, setOpenProdutM] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [openProdut, setOpenProdut] = useState([]);

  const [carrito, setCarrito] = useState([]);

  const setNewCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
  };

  const { data: producto, reset } = useForm({
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


  const tbStructure = {
    'Pedido': 'numero_pedido',
    'Cliente': 'nombre',
    'Telefono': 'telefono',
    'Cantidad': 'cantidad',
    'Fecha': 'fecha2',
    'Estado': 'status'
  }




  return (
    <Layout carrito={{}} setNewCarrito={setNewCarrito} user={user} >

      <Head title="Pedido" />

      <h1 data-cy="page-title" className="pt-4 my-4 font-bold text-4xl">
        Pedido
      </h1>

      <div className='p-2 pt-8'>
        <DataTable
          data={pedidos}
          tbStructure={tbStructure}
          action={true}
        />

      </div>

    </Layout>
  );
}
