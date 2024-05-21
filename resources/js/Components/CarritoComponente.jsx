// CarritoComponente.js
import axios from 'axios';
import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import { set } from 'date-fns';
import PhoneInput from 'react-phone-number-input/input'

const CarritoComponente = ({ carrito, setNewCarrito, close ,setPedidoCreado }) => {


  const [response, setResponse] = useState([]);
  const [value, setValue] = useState()

  const { data, setData, post, reset } = useForm({
    nombre: "",
    telefono: "",

  });

  useEffect(() => {
    const DatosGuardados = JSON.parse(localStorage.getItem('perdatos')) || [];
    setData(DatosGuardados);
  }, []);

  useEffect(() => {
    localStorage.setItem('perdatos', JSON.stringify(data));
    console.log(data)
  }, [data]);


  useEffect(() => {
    setNewCarrito(carrito);
  },[carrito]);


  const eliminarDelCarrito = (indice) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(indice, 1);
    setNewCarrito(nuevoCarrito);
  };

  const enviarPedido = (e) => {

    
    e.preventDefault();
    axios.post(route("pedido.add", { ...data, carrito }))
      .then((response) => {
       
        alert(response.data.message);
        console.log(response.data)
        console.log(response.data.whatsapp_response)
        setPedidoCreado(response.data);
        //setNewCarrito([]);
        close();

      })
      .catch((error) => {
       console.log(error.response.data.error)
       alert(error.response.data.error);
      });
  }

  

  const Limpiar = () => {
    setNewCarrito([]);

    localStorage.removeItem('carrito');
  };
  function isValidPhoneNumber(phoneNumber) {
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber);
  }

  return (

<>

    <form onSubmit={enviarPedido} className="flex flex-col items-center   overflow-x-auto shadow-md sm:rounded-lg border">
      <div className="flex justify-start flex-wrap min-[500px]:flex-nowrap  gap-2 w-full p-2  ">

        <label className="flex  w-full gap-1">
          <span>Nombre:</span>
          <input placeholder="Ingrese su nombre"  required={true}  value={data?.nombre} onChange={(e) => { setData({ ...data, nombre: e.target.value }) }} type="text" className="w-full border rounded-md  border-none focus:outline-blue-300 p-0 px-2"  />
        </label>

        <label className="flex w-full gap-1">

          <span>Telefono:</span>
         
          <PhoneInput
     country='DO'
      value={data?.telefono}
      onChange={(e) => setData({ ...data, telefono: e })}
      className="w-full  border-none  rounded-md outline-none  focus:outline-blue-300 p-0 px-2"
      placeholder="Ingrese su telefono"
      pattern="^\(\d{3}\) \d{3}-\d{4}$"
     required={true}
     />
   
        </label>
       
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="sm:px-6 py-3">
              Imagen
            </th>
            <th scope="col" className="sm:px-6 py-3">
              Código
            </th>
            <th scope="col" className="sm:px-6 py-3">
              Cantidad
            </th>
            <th scope="col" className="sm:px-6 py-3">
              Comentario
            </th>
            <th scope="col" className="sm:px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>

          {carrito?.map((item, index) => {
            return (
              <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td>
                  <img className="h-16 object-cover w-16" src={`/images/${item.codigo}`} alt="foto" />
                </td>
                <td className="sm:px-6 py-4">
                  {item.codigo}
                </td>
                <td className="sm:px-6 py-4">
                  {item.cantidad}
                </td>
                <td className="sm:px-6 py-4">
                  {item.comentario}
                </td>

                <td className="sm:px-6 py-4">
                  <button type='button' className='bg-red-500 rounded-md hover:bg-red-400 text-white p-1 ' onClick={() => eliminarDelCarrito(index)}>Eliminar</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>


      <button type='submit' className='bg-green-500 my-2 w-fit px-2 rounded-md hover:bg-green-400 text-white p-1'>Enviar Pedido</button>

      <button onClick={Limpiar} type='button' className='absolute bottom-6 right-8 text-xs bg-red-500 my-2 w-fit px-2 rounded-md hover:bg-black text-white p-1'>Borrar todo</button>

    </form>

   

    
</>
  )

};

export default CarritoComponente;
