
import { useInView } from 'react-intersection-observer';    

// Coloca este componente DENTRO de Home.jsx o en un archivo Components/LazyImage.jsx
const LazyLoadedImage = ({ file }) => {
    // Configura la observación:
    const { ref, inView } = useInView({
        // `rootMargin: '200px 0px'` emula el prop offset={200}
        rootMargin: '200px 0px', 
        triggerOnce: true, // Importante: Solo cargará una vez
    });

    return (
        // El div contenedor recibe la referencia (ref)
        <div 
            ref={ref} 
            className="w-full h-full"
            // Opcional: Establecer una altura mínima mientras carga para evitar saltos
            style={{ minHeight: '100px', backgroundColor: '#f0f0f0' }} 
        >
            {/* Si 'inView' es true, renderizamos la imagen; si no, un placeholder */}
            {inView ? (
                <img
                    className="h-full object-cover w-full"
                    src={`${file}`}
                    alt="Descripción"
                />
            ) : (
                // Placeholder o contenido vacío mientras se carga
                <div className="h-full w-full"></div> 
            )}
        </div>
    );
};

export default LazyLoadedImage;