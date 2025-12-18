import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {



  return (
      <div className="font-ubuntu pb-20 bg-[#332851] w-full h-screen relative overflow-hidden flex items-center justify-center flex-col">
        <h1 className="acceso-403">403</h1>
        <h2 className="acceso-denegado">Este pedido no existe</h2>

        <Link href={route('home')} className='acceso-home cursor-pointer '>
          ir al Inicio
        </Link>
      </div> 
  );
}
