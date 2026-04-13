import fondo from "@/assets/images/colorfullLogo.png";

export default function Guest({ children }) {
    return (
        <div className="  w-screen h-screen    ">
            <img src={fondo} alt="Logo" className="w-screen h-screen object-cover opacity-25  absolute  top-0 z-1" />
            {children}

        </div>
    );
}
