import React from 'react';

export function Pagination({ data, currentPage, setCurrentPage,maxVisiblePages }) {
    

    const totalPages = data.length % maxVisiblePages === 0 ?
        data.length / maxVisiblePages :
        parseInt(data.length / maxVisiblePages) + 1;

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

        if (totalPages > maxVisiblePages) {
            const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

            if (currentPage > halfMaxVisiblePages) {
                startPage = currentPage - halfMaxVisiblePages;
                endPage = currentPage + halfMaxVisiblePages;
            } else {
                startPage = 1;
                endPage = maxVisiblePages;
            }

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = totalPages - maxVisiblePages + 1;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            // Agregar elementos de paginación con el número de página correspondiente
            pages.push(
                <li key={i}>
                    <a
                        href="#"
                        onClick={() => goToPage(i)}
                        className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === i ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : ''}`}
                    >
                        {i}
                    </a>
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
                    <a
                        href="#"
                        onClick={() => goToPage(currentPage - 1)}
                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                    </a>
                </li>
                {renderPagination()}
                <li>
                    <a
                        href="#"
                        onClick={() => goToPage(currentPage + 1)}
                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <span className="sr-only">Next</span>
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

