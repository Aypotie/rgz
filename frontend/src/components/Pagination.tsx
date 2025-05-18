interface Props {
    pageSize: number;
    total: number;
    setCurrentPage: (page: number) => void;
    currentPage: number;
}

export const Pagination = (props: Props) => {
    const maxPage = Math.ceil(props.total / props.pageSize);

    const handlePageChange = (e: React.MouseEvent, page: number) => {
        e.preventDefault();
        // Снимаем фокус с текущей кнопки
        (e.currentTarget as HTMLElement).blur();
        props.setCurrentPage(page);
    };

    // Генерация видимых номеров страниц
    const getVisiblePages = () => {
        const pages = [];
        const startPage = Math.max(1, props.currentPage - 1);
        const endPage = Math.min(maxPage, props.currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination pagination-sm">
                {/* Previous button */}
                <li className={`page-item ${props.currentPage <= 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={(e) => handlePageChange(e, props.currentPage - 1)}
                        disabled={props.currentPage <= 1}
                    >
                        Previous
                    </button>
                </li>

                {/* First page */}
                {visiblePages[0] > 1 && (
                    <>
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={(e) => handlePageChange(e, 1)}
                            >
                                1
                            </button>
                        </li>
                        {visiblePages[0] > 2 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                    </>
                )}

                {/* Visible pages */}
                {visiblePages.map(page => (
                    <li key={page} className={`page-item ${props.currentPage === page ? 'active' : ''}`}>
                        <button
                            className="page-link"
                            onClick={(e) => handlePageChange(e, page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Last page */}
                {visiblePages[visiblePages.length - 1] < maxPage && (
                    <>
                        {visiblePages[visiblePages.length - 1] < maxPage - 1 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={(e) => handlePageChange(e, maxPage)}
                            >
                                {maxPage}
                            </button>
                        </li>
                    </>
                )}

                {/* Next button */}
                <li className={`page-item ${props.currentPage >= maxPage ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={(e) => handlePageChange(e, props.currentPage + 1)}
                        disabled={props.currentPage >= maxPage}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};