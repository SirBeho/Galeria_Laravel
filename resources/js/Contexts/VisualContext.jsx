// resources/js/Contexts/VisualContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const VisualContext = createContext();

export const useVisual = () => {
    const context = useContext(VisualContext);
    
    // 🟢 BLINDAJE: Si no hay Provider, devolvemos valores dummy para que no explote
    if (!context) {
        console.log("VisualContext no encontrado, usando valores por defecto.");
        return {
            verJuegos: false,       // Valor por defecto
            toggleVerJuegos: () => console.warn("VisualContext no activo aquí"),
            estadoVisual: 0,       // Valor por defecto
            cycleEstadoVisual: () => {},
            showEliminar: false,
            setShowEliminar: () => {},
            toggleDeleteMode: () => {},
            isActive: false        // Bandera opcional
        };
    }
    
    return { ...context, isActive: true };
}

export const VisualProvider = ({ children }) => {
    // 1. Estado: Ver Juegos vs Galería
    const [verJuegos, setVerJuegos] = useState(false);

    // 2. Estado: Tamaño de Grilla (Persistente)
    const [estadoVisual, setEstadoVisual] = useState(() => {
        const guardado = localStorage.getItem("estadoVisual");
        return guardado ? parseInt(guardado) : 0;
    });

    // 3. Estado: Modo Eliminar
    const [showEliminar, setShowEliminar] = useState(false);

    useEffect(() => {
        localStorage.setItem("estadoVisual", estadoVisual.toString());
    }, [estadoVisual]);

    // --- ACCIONES ---
    const toggleVerJuegos = () => setVerJuegos(prev => !prev);
    
    const cycleEstadoVisual = () => setEstadoVisual(prev => (prev + 1) % 3);

    // 🟢 Acciones para Eliminar
    const toggleDeleteMode = () => {
        setShowEliminar(prev => !prev);
    };

    return (
        <VisualContext.Provider value={{ 
            verJuegos, 
            toggleVerJuegos, 
            estadoVisual, 
            cycleEstadoVisual,
            showEliminar,
            toggleDeleteMode
        }}>
            {children}
        </VisualContext.Provider>
    );
};