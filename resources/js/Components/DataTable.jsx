import React, { useEffect, useState } from 'react'
import { Pagination } from './Pagination';
import { Link } from '@inertiajs/react';


export function DataTable({ data, action, tbStructure, onNew, onUpdate, onDelete, proteccionUser = 0 }) {

    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [slicedData, setSlicedData] = useState([]);
    const [currentOrder, setCurrentOrder] = useState('asc');
   

    const [itemsPerPage, setItemsPerPage] = useState(() => {
       
        const valor = localStorage.getItem("itemsPerPage");
        return valor ? parseInt(valor) : 5;
    });

    useEffect(() => {
        localStorage.setItem("itemsPerPage", itemsPerPage);
    }, [itemsPerPage]);


  
    const background =[ 'bg-red-500','bg-yellow-300','bg-yellow-300','bg-green-500'];

    const tbHeaders = Object.keys(tbStructure);
    const tbValues = Object.values(tbStructure);

    
    const handleSort = (columnName) => {
        
        if (tbStructure.hasOwnProperty(columnName)) {
            const key = tbStructure[columnName];
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            setCurrentOrder(newOrder);

            const sortedData = [...data].sort((a, b) => {
                if (currentOrder === 'asc') {
                    return a[key] > b[key] ? 1 : -1;
                } else {
                    return b[key] > a[key] ? 1 : -1;
                }
            });
            setFilteredData(sortedData);

            setCurrentPage(1);

        }
    };

  

    // contar la data para separarla por pagina
    const getCurrentPageData = (dataToSlice) => {

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setSlicedData(dataToSlice.slice(startIndex, endIndex));

        console.log(dataToSlice.slice(startIndex, endIndex))

    };

    const searchData = (searchValue) => {
        setCurrentPage(1)
        // const searchedData = data.filter(item => item.nombre.toLocaleLowerCase().includes(searchValue))
        const searchedData = Object.values(data).filter(item => JSON.stringify(item).toLowerCase().includes(':"' + searchValue))
        setFilteredData(searchedData);
        console.log(proteccionUser)

    }
    useEffect(() => {
        setFilteredData(data)
       
    }, [data])

    useEffect(() => {
        getCurrentPageData(filteredData);
    }, [filteredData, currentPage,itemsPerPage])


   useEffect(() => {
        const sortedData = [...data].sort((a, b) => {
            return b['numero_pedido'] > a['numero_pedido'] ? 1 : -1;
        });
        setFilteredData(sortedData);

    }, []);

    return (
        <>
            <div className="my-2 flex sm:flex-row flex-col gap-4 items-center">

                <div className="block relative">
                    <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                            <path
                                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                            </path>
                        </svg>
                    </span>
                    <input placeholder="Buscar"
                        className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                        onChange={(e) => searchData((e.target.value).toLocaleLowerCase())}
                    />
                </div>

                <div>
                    <button className='bg-blue-600 rounded-sm h-9 px-2 hover:bg-blue-700 hover:shadow-md  text-gray-950 hover:text-gray-100'
                        onClick={onNew}
                    >
                        Nuevo
                    </button>
                </div>
                
            </div>

            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 pt-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal overflow-hidden">
                        <thead>
                            <tr>
                                {tbHeaders.map(columnName =>
                                    <th key={columnName} onClick={() => handleSort(columnName)}
                                        className="thStyle cursor-pointer">
                                        {columnName}
                                    </th>
                                )}

                                {action &&
                                    <th className="thStyle">
                                        Accion
                                    </th>
                                }
                            </tr>

                        </thead>

                        <tbody >
                            {slicedData && slicedData.map((val, index) =>
                                <tr key={index}>
                                    {tbValues.map((key, i) =>



                                        key == 'status' ? (

                                            
                                            <td key={i} className="px-5 py-3 border-b border-gray-200 bg-white text-base font-medium">
                                                <span className={`${background[val.status ]} rounded-lg px-1 `}> {val.status == 0 ? 'Cancelado' : val.status == 1 ? 'Pendiente' : val.status == 2 ? 'Pendiente + Ws' : 'Completado'}</span>
                                            </td>

                                        ) : (
                                            <td key={i} className="px-5 py-3 border-b border-gray-200 bg-white text-base font-medium">
                                                {
                                                    key.split('.').reduce((acc, currentKey) => acc ? acc[currentKey] : undefined, val)
                                                }
                                            </td>

                                        )

                                    )}
                                    {action &&
                                        <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                            {(proteccionUser == 0 || proteccionUser != val.id) && (
                                                <Link href={route('pedido.view',{p:val.numero_pedido,key: val.key})}  className='flex gap-2 items-center cursor-pointer hover:scale-110 hover:text-blue-500 hover:fill-blue-500'>
                                                     <span className='font-bold'>Ver</span>
                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='w-7'>
                                                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                                     </svg>

                                                </Link>

                                            )


                                            }


                                        </td>
                                    }
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-between py-4'>

                    


                    <label className="flex items-center gap-4 h-10 bg-white text-gray-500 leading-tight  rounded-lg  overflow-hidden p-4">
                        <span>Filas</span>
                        <select 
                         value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}

                        className=" border-0 hover:bg-gray-100 hover:text-gray-700 " >
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>

                    </label>


                    <Pagination
                        data={filteredData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        maxVisiblePages={itemsPerPage}
                    />
                </div>

            </div>
        </>
    )
}
