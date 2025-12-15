import React, { createContext, useState, useEffect, useContext } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        return {
            carrito: [], // Carrito vacío por defecto
            setCarrito: () => { },
            agregarAlCarrito: () => console.warn("Carrito no activo en esta página"),
            eliminarDelCarrito: () => { },
            vaciarCarrito: () => { },
            isActive: false
        };
    }

    return { ...context, isActive: true }; // Todo normal
}

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    // 1. Cargar al inicio
    useEffect(() => {
        const guardado = JSON.parse(localStorage.getItem('carrito'));
        if (guardado) setCarrito(guardado);
    }, []);

    // 2. Guardar al cambiar
    useEffect(() => {
        if (carrito.length > 0) {
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
    }, [carrito]);

    // Funciones auxiliares
    const agregarAlCarrito = (item) => {
        setCarrito([...carrito, item]);
    };


    const eliminarDelCarrito = (indice) => {
        const nuevoCarrito = carrito.filter((_, i) => i !== indice);
        setCarrito(nuevoCarrito);
        if (nuevoCarrito.length === 0) localStorage.removeItem('carrito');
    };

    const vaciarCarrito = () => {
        setCarrito([]);
        localStorage.removeItem('carrito');
    };

    return (
        <CarritoContext.Provider value={{ carrito, setCarrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}>
            {children}
        </CarritoContext.Provider>
    );
};