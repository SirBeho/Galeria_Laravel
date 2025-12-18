import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useVisual } from '@/Contexts/VisualContext';
import ConfettiLauncher from '@/Components/ConfettiLauncher';


const AvisoJuguetesProximos = () => {
    // 💡 Estado: Usado para la funcionalidad interactiva de "Notificarme"
    const [notificado, setNotificado] = useState(false);
    const { toggleVerJuegos } = useVisual();
    const [launchCount, setLaunchCount] = useState(0);

    // 💡 Simulación de envío al backend (deberías reemplazar esto con una llamada a Inertia/Axios)
    const solicitarNotificacion = () => {
        // Aquí iría tu lógica real: Inertia.post('/subscribe/toys')
        setLaunchCount(prevCount => prevCount + 1);
        // Simulación de éxito
        setTimeout(() => {
            setNotificado(true);
            //console.log("Suscripción para notificación enviada.");
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-white border border-dashed border-gray-300 rounded-lg shadow-xl transition-all duration-500 ">

            <ConfettiLauncher launchKey={launchCount} />

            {/* 🛑 TÍTULO Y ESTADO */}
            <div className="text-center mb-6">
                <svg className="w-16 h-16 mx-auto text-yellow-500 mb-3 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.082 17.5l-1.092 1.092m1.092-1.092L14.5 14.5m-3.418 3.092L14.5 14.5m0 0l-1.092 1.092m1.092-1.092L11.082 17.5M21 12a9 9 0 11-18 0 9 9 0 0118 0Z"></path>
                </svg>
                <h2 className="text-3xl font-extrabold text-gray-800">
                    ¡Estamos Preparando la Diversión!
                </h2>
                <p className="text-gray-500 mt-2">
                    Aún no hemos agregado juguetes a esta sección.
                </p>
            </div>

            {/* 🚀 ZONA INTERACTIVA: Botón o Mensaje de Éxito */}
            <div className="w-full max-w-sm">
                {!notificado ? (
                    <button
                        onClick={solicitarNotificacion}
                        className="animate-wiggle  w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105 shadow-md"
                    >
                        ✔️ Avísame cuando lleguen
                    </button>
                ) : (
                    <div className="text-center p-3 bg-green-100 text-green-700 rounded-md shadow-inner">
                        <p className="font-semibold">¡Listo! Te avisaremos al instante.</p>
                        <p className="text-sm mt-1">Gracias por tu interés, pronto habrá novedades.</p>
                    </div>
                )}
            </div>

            {/* 🧭 LLAMADA A LA ACCIÓN SECUNDARIA */}
            <div className="mt-6 border-t pt-4 w-full text-center">
                <p className="text-sm text-gray-600 mb-2">Mientras esperas, puedes:</p>
                <button
                    onClick={toggleVerJuegos}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150 ease-in-out"
                >
                    Explorar nuestras otras categorías de productos →
                </button>
            </div>

        </div>
    );
};

export default AvisoJuguetesProximos;