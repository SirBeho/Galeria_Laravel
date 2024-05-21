import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
});

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
                'per2': 'calc(59vw - 291px)',
            },
        },
    },

    plugins: [
        require("flowbite/plugin")({
            charts: true,
        }),

        forms,
    ],
};
