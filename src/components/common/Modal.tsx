import React, { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnClickOutside?: boolean;
    showCloseButton?: boolean;
    footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeOnClickOutside = true,
    showCloseButton = true,
    footer,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
        };
    }, [isOpen, onClose, closeOnClickOutside]);

    if (!isOpen) return null;

    // Determine modal width based on size prop
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }[size];

    // Add animation classes
    const backdropClasses = isOpen
        ? 'opacity-100 transition-opacity duration-300 backdrop-blur-xs'
        : 'opacity-0 pointer-events-none';

    const modalClasses = isOpen
        ? 'opacity-100 translate-y-0 transition-all duration-300'
        : 'opacity-0 translate-y-4 pointer-events-none';

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ${backdropClasses}`}>
            <div
                ref={modalRef}
                className={`w-full ${sizeClasses} bg-white rounded-lg shadow-xl overflow-hidden ${modalClasses}`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
                {/* Modal Header */}
                {(title || showCloseButton) && (
                    <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4">
                        <div className="font-medium text-lg text-gray-800">{title}</div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Modal Content */}
                <div className="px-6 py-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                    {children}
                </div>

                {/* Modal Footer */}
                {footer && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;