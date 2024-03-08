import React, { useEffect, useState } from "react";
import NavBar from '@/Components/NavBar';


export default function Authenticated({  header = false, children ,carrito , setNewCarrito , user }) {

   
   

    return (
        <div className="min-h-screen h-full bg-gray-200 ">
         
            <NavBar carrito={carrito} setNewCarrito={setNewCarrito} user={user} />
           
                <main className="sm:px-8 mt-14">{children}</main> 
        </div>
    );
}
