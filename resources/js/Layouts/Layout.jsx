import React from "react";
import NavBar from '@/Components/NavBar';


export default function Layout({ children, user }) {

    return (
        <div className="min-h-screen bg-gray-200">
            <NavBar user={user} />

            <main className="sm:px-6 pt-14">
                {children}
            </main>
        </div>
    );
}