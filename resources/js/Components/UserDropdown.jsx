import React from "react";
import { usePage } from "@inertiajs/react";
import Dropdown from "./Dropdown";

const UserDropdown = ({ user, showEliminar, toggleDeleteMode }) => {
  const { primaryColor, } = usePage().props.designSettings;

  return (
    <div className=" sm:flex sm:items-center ">
      <div className=" relative">
        <Dropdown>
          <Dropdown.Trigger>
            <span className="inline-flex rounded-md">
              <button
                type="button"
                className=" inline-flex items-center  px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-200   hover:text-gray-400 focus:outline-none transition ease-in-out duration-150"
              >
                <span>{user?.name}</span>

                <svg
                  className="ml-2 -mr-0.5 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Link href={route('panel')} method="get" as="button">
              Pedidos
            </Dropdown.Link>

            <Dropdown.Link href={route('subir')} method="get" as="button">
              Subir Imagenes
            </Dropdown.Link>

            <Dropdown >
              <div style={{ backgroundColor: primaryColor }}
                className='bg-nav block w-full px-4 py-2 text-left text-sm leading-5 text-gray-300  focus:outline-none hover:text-slate-400 transition duration-150 ease-in-out '>
                <label className="inline-flex items-center cursor-pointer gap-2 ">
                  <span className=" text-sm  ">{showEliminar ? "Mostrar eliminar" : "Sin eliminar"}</span>
                  <input type="checkbox" checked={showEliminar} onChange={toggleDeleteMode} value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </Dropdown>

            <Dropdown.Link href={route('logout')} method="post" as="button">
              Log Out
            </Dropdown.Link>

          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserDropdown;