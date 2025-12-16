import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// 🛑 Este componente solo se encarga de lanzar el confeti.
// Ya no es un input de checkbox, será un componente funcional puro.

/**
 * Componente reutilizable para lanzar confeti.
 * Se activa automáticamente cuando el prop 'shouldLaunch' cambia a true.
 * * @param {object} props
 * @param {boolean} props.shouldLaunch - Si es true, lanza el confeti. (Ideal para clicks únicos)
 * @param {number} [props.launchKey] - Usar si necesitas relanzar el confeti múltiples veces, 
 * basado en un cambio de valor (ej. contador de éxito).
 * @param {number} [props.duration=3000] - Duración del efecto en milisegundos.
 * @param {number} [props.pieces=500] - Cantidad de piezas.
 * @param {string[]} [props.colors] - Array de colores.
 */
export default function ConfettiLauncher({
    shouldLaunch,
    launchKey,
    duration = 3000,
    pieces = 500,
    colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'] // Colores Indigo, Verde, Amarillo, Rojo
}) {

    const [showConfetti, setShowConfetti] = useState(false);

    // 💡 Lógica Central: Se ejecuta cuando 'shouldLaunch' o 'launchKey' cambian.
    useEffect(() => {
        // Opción 1: Basado en el booleano (ideal para efectos al montar)
        if (shouldLaunch) {
            setShowConfetti(true);
        }

        // Opción 2: Basado en el cambio de 'launchKey' (ideal para clicks)
        // Se lanza si launchKey no es undefined y es diferente al valor inicial.
        if (launchKey !== undefined && launchKey !== null) {
            setShowConfetti(true);
        }

    }, [shouldLaunch, launchKey]);

    // 💡 Lógica de Desactivación: Controla por cuánto tiempo se muestra.
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);


    return (
        <>
            {showConfetti && (
                <Confetti
                    // Ajustamos el tamaño a la ventana completa para un efecto impactante
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={pieces}
                    recycle={false}
                    tweenDuration={1000}
                    colors={colors}
                    // 🚨 Estilo fijo para que cubra toda la pantalla
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
                />
            )}
        </>
    );
}