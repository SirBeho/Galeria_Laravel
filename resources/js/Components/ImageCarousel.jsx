import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './galeria.css';

export function ImageCarousel({ Imagename, onNext, onPrev, isFirst, isLast }) {

    // --- ESTADOS ---
    const [direction, setDirection] = useState('right-to-left');

    // Estados para el arrastre (Swipe)
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragDelta, setDragDelta] = useState(0);

    const minSwipeDistance = 50; // Mínimo píxeles para cambiar de foto

    // --- HANDLERS DE NAVEGACIÓN ---
    const handlePrev = () => {
        setDirection('left-to-right');
        onPrev();
    };

    const handleNext = () => {
        setDirection('right-to-left');
        onNext();
    };

    // --- HANDLERS DE GESTOS (MOUSE/TOUCH) ---

    const onStart = (e) => {
        // Prevenir comportamiento por defecto (selección de texto, etc.)
        // e.preventDefault(); // A veces bloquea el scroll vertical en móviles, úsalo con cuidado.
        setIsDragging(true);
        // Unificar evento Mouse/Touch
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        // Calculamos cuánto se ha movido desde el inicio
        setDragDelta(clientX - startX);
    };

    const onEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);


        // Lógica de decisión: ¿Cambiamos de foto o rebotamos?
        if (Math.abs(dragDelta) > minSwipeDistance) {
            if (dragDelta < 0) {
                // Arrastró a la izquierda -> QUIERE IR A SIGUIENTE
                if (!isLast) handleNext();
            } else {
                // Arrastró a la derecha -> QUIERE IR A ANTERIOR
                if (!isFirst) handlePrev();
            }
        }

        // Reseteamos el desplazamiento para que el CSS tome el control de la animación
        setDragDelta(0);
    };



    //sacar el nombre de la imagen actual sin la ruta ni la extensión   



    // Estilo dinámico para mover la tarjeta mientras arrastras
    const dragStyle = {
        transform: `translateX(${dragDelta}px)`,
        // Si no estamos arrastrando, suavizamos el retorno a 0 (rebote)
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab'
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center select-none">

            {/* Botón Anterior */}
            <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                disabled={isFirst}
                className={`absolute hover-effect-chaild h-full left-4 z-50 p-3 rounded-full bg-transparent hover:bg-transparent/[.01]  text-white  transition-all ${isFirst ? 'hidden' : 'block'}`}
            >
                <svg className="h-12 w-12 drop-shadow-md bg-white/20 rounded-full p-2 backdrop-blur-sm  " fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>



            {/* AREA ACTIVA DE ARRASTRE */}
            <div
                className="carousel-viewport w-full h-full touch-pan-y" // touch-pan-y permite scroll vertical en móvil pero captura horizontal
                onMouseDown={onStart}
                onMouseMove={onMove}
                onMouseUp={onEnd}
                onMouseLeave={onEnd}
                onTouchStart={onStart}
                onTouchMove={onMove}
                onTouchEnd={onEnd}
            >
                {/* Aplicamos el estilo de arrastre a este contenedor intermedio.
                    TransitionGroup está dentro para manejar el cambio de slides.
                */}
                <div className="w-full h-full" style={dragStyle}>
                    <TransitionGroup
                        className="w-full h-full"
                        childFactory={child => React.cloneElement(child, {
                            classNames: direction // 🟢 El truco 'childFactory' se mantiene
                        })}
                    >
                        <CSSTransition
                            key={Imagename}
                            timeout={500}
                            classNames={direction}
                        >
                            {/* Slide Individual */}
                            <div className="carousel-slide flex items-center justify-center p-4">

                                <div className="relative w-full h-full max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">



                                    {/* <h2 className="absolute top-4 left-6 text-2xl font-bold text-gray-800 z-10 bg-white/80 px-3 py-1 rounded-lg backdrop-blur-md shadow-sm">
                                        {currentImageName}
                                    </h2> */}

                                    {/* Imagen */}
                                    <div className="w-full h-full p-6">
                                        {Imagename ? (
                                            <img
                                                className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
                                                src={`${Imagename}`}
                                                alt={Imagename}
                                                // Evitamos el arrastre nativo de la imagen "fantasma"
                                                onDragStart={(e) => e.preventDefault()}
                                            />
                                        ) : (
                                            <span className="text-gray-400">Imagen no disponible</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                disabled={isLast}
                className={`absolute hover-effect-chaild h-full right-4 z-50 bg-transparent hover:bg-transparent/[.01]  text-white   transition-all ${isLast ? 'hidden' : 'block'}`}
            >
                <svg className="h-12 w-12 drop-shadow-md bg-white/20 rounded-full p-2 backdrop-blur-sm hover:bg-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>

            </button>
        </div>
    );
}