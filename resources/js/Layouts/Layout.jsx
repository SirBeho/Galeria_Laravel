import React from "react";
import NavBar from '@/Components/NavBar';
// Ya no necesitamos importar useVisual aquí

export default function Layout({ children, user }) {
    
    // 🟢 ¡Mira qué limpio! No recibimos ni pasamos props visuales.
    
    return (
        <div className="min-h-screen bg-gray-200">
            <NavBar user={user} />
            
            <main className="sm:px-6 mt-14">
                {children}
            </main> 
        </div>
    );
}