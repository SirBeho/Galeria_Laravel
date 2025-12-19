import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            screens: {
                'td': '800px',
            },
            fontFamily: {
                'ubuntu': ['Ubuntu', 'sans-serif'],
            },
            colors: {
                customGray: "#f7f7f7",
                offwhite: "#ffffff",
                softgray: "#f2f2f2",
                darkgray: "#57687a",
                textgray: "#767171",
                darkblue: "#011f5e",
                softblue: "#0099ff",
                nav: "#343a40",
                upload: "#57a844",
                iconssvg: "#cacdd7",


            },
            width: {
                'per1': 'calc(100vw - 16rem)',
                'per2': 'calc(59vw - 292px)',
            },
            keyframes: {
                // Define el keyframe de agitación
                wiggle: {
                    '0%, 2.5%': { transform: 'translate(2px, 2px) rotate(-1deg)' },
                    '5%, 17.5%': { transform: 'translate(-2px, 0) rotate(-1deg)' },
                    '10%': { transform: 'translate(2px, -2px) rotate(1deg)' },
                    '15%': { transform: 'translate(-2px, 2px) rotate(-1deg)' },
                    '20%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                },
                shaketop: {
                    '0%, 50%, 100%': {
                        transform: 'translate(0, 0) rotate(0deg)'
                    },

                    // 🟢 5%: Rotación positiva + Traslación ligera a la derecha
                    '5%': {
                        transform: 'translate(2px, 2px) rotate(2deg)',
                    },

                    // 🟢 10%, 20%, 30%: Rotación negativa fuerte + Traslación a la izquierda
                    '10%, 20%, 30%': {
                        transform: 'translate(-4px, -2px) rotate(-4deg)',
                    },

                    // 🟢 15%, 25%, 35%: Rotación positiva fuerte + Traslación a la derecha
                    '15%, 25%, 35%': {
                        transform: 'translate(4px, 0) rotate(4deg)',
                    },

                    // 🟢 40%: Rotación negativa suave + Traslación a la izquierda
                    '40%': {
                        transform: 'translate(-2px, 0) rotate(-2deg)',
                    },

                    // 🟢 45%: Rotación positiva suave + Traslación a la derecha
                    '45%': {
                        transform: 'translate(2px, 0) rotate(2deg)',
                    },
                },
                sheke2: {


                    '0%, 50%, 100%': { transform: 'translate(0)' },
                    '10% ,20% , 30% ,40%': { transform: 'translate(-5px ,5px)' },
                    '5%, 15%, 25%, 35% , 45%': { transform: 'translate(5px , -5px)' },


                }
            },
            animation: {
                // Crea la clase utilitaria 'animate-wiggle'
                wiggle: 'wiggle 4s ease-in-out infinite',
                shaketop: 'shaketop 2s ease-in infinite both',
                sheke2: 'sheke2 2s ease-in-out infinite',
            }
        },
    },

    plugins: [
        require("flowbite/plugin")({
            charts: true,
        }),

        forms,
    ],
};
