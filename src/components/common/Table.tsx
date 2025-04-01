import React from 'react';

interface TableColumn<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    className?: string;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}

function Table<T>({
    columns,
    data,
    keyExtractor,
    className = '',
    onRowClick,
    emptyMessage = 'Tidak ada data',
}: TableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100">
            <table className={`min-w-full bg-white ${className}`}>
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                className={onRowClick ? 'cursor-pointer transition-colors duration-150 hover:bg-gray-50' : ''}
                                onClick={onRowClick ? () => onRowClick(item) : undefined}
                            >
                                {columns.map((column, index) => (
                                    <td key={index} className={`px-6 py-4 text-sm text-gray-700 ${column.className || ''}`}>
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(item)
                                            : item[column.accessor] as React.ReactNode}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-sm text-gray-500 text-center bg-gray-50">
                                <div className="flex flex-col items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    {emptyMessage}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;