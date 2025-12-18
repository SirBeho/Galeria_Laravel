import logo from "/public/assets/colorfullLogo.png";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 ">
            {children}

            <div className='absolute opacity-25 w-screen h-screen '>


                <img src={logo} alt="Logo" className="w-full h-full object-cover  " />

            </div>




        </div>
    );
}
