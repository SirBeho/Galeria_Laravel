import { useInView } from 'react-intersection-observer';
import React, { useState } from 'react';

const LazyLoadedImage = ({ file }) => {
    const [loaded, setLoaded] = useState(false);
    const { ref, inView } = useInView({
        rootMargin: '200px 0px',
        triggerOnce: true,
    });

    // Generamos la ruta de la miniatura
    const thumbSrc = file.replace('/gallery/', '/gallery/thumbs/').replace('.webp', '_thumb.webp');


    return (
        <div
            ref={ref}
            className="w-full h-full relative overflow-hidden bg-gray-200"
            style={{ minHeight: '100px' }}
        >
            {inView && (
                <>
                    {/* MINIATURA: Se carga rápido y sirve de fondo difuminado */}
                    <img
                        src={thumbSrc}
                        alt="preview"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${loaded ? 'opacity-0' : 'opacity-100'
                            }`}
                        style={{ filter: 'blur(0px)' }} // Un pequeño desenfoque oculta los píxeles
                    />

                    {/* IMAGEN REAL: Se carga encima con un fade-in suave */}
                    <img
                        src={file}
                        alt="Descripción"
                        onLoad={() => setLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading="lazy"
                    />
                </>
            )}
        </div>
    );
};

export default LazyLoadedImage;