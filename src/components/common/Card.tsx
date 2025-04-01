import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
    noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
    children, 
    title, 
    className = '',
    headerAction,
    noPadding = false
}) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-200 hover:shadow-md ${className}`}>
            {title && (
                <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                    {typeof title === 'string' ? (
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    ) : (
                        title
                    )}
                    {headerAction && (
                        <div className="ml-4">
                            {headerAction}
                        </div>
                    )}
                </div>
            )}
            <div className={noPadding ? '' : 'p-5'}>{children}</div>
        </div>
    );
};

export default Card;