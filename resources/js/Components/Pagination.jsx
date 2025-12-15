import React from 'react';

export function Pagination({ data, currentPage, setCurrentPage,itemsPerPage }) {
    

    const totalPages = data.length % itemsPerPage === 0 ?
        data.length / itemsPerPage :
        parseInt(data.length / itemsPerPage) + 1;

     
    const goToPage = (pageNumber) => {
        if(pageNumber > totalPages ){
            setCurrentPage(1);
            return;
        }
        if(pageNumber <= 0 ){
            setCurrentPage(totalPages);
            return;
        }

        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pages = [];
        let startPage = 1;
        let endPage = totalPages;

        console.log(totalPages, itemsPerPage)

        if (totalPages > itemsPerPage) {
            const halfitemsPerPage = Math.floor(itemsPerPage / 2);

            if (currentPage > halfitemsPerPage) {
                startPage = currentPage - halfitemsPerPage;
                endPage = currentPage + halfitemsPerPage;
            } else {
                startPage = 1;
                endPage = itemsPerPage;
            }

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = totalPages - itemsPerPage + 1;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            // Agregar elementos de paginación con el número de página correspondiente
            pages.push(
                <li key={i}>
                    <button
                        onClick={() => goToPage(i)}
                        className={` ${currentPage === i ? 'cursor-default opacity-50' : 'hover:bg-gray-100 hover:text-gray-700'}
                        flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white `}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        if (startPage > 1) {
            pages.unshift(
                <li key="ellipsisStart">
                    <span>...</span>
                </li>
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <li key="ellipsisEnd">
                    <span>...</span>
                </li>
            );
        }

        return pages;
    };

    return (
        <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                        className={` ${currentPage === 1 ? 'cursor-no-drop opacity-50' : 'hover:bg-gray-100 hover:text-gray-700'}
                         flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                    </button>
                </li>
                {renderPagination()}
                <li>
                    <button
                        disabled={currentPage == totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                        className={` ${currentPage === totalPages ? 'cursor-no-drop opacity-50' : 'hover:bg-gray-100 hover:text-gray-700'}
                       flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                        <span className="sr-only">Next</span>
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

