import React from 'react';

interface InputProps {
    type?: string;
    label?: string;
    value: string | undefined;  // Allow undefined
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    name?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
    maxLength?: number;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    label,
    value = '',
    onChange,
    placeholder,
    error,
    required = false,
    name,
    disabled = false,
    icon,
    className = '',
    maxLength,
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2
                    ${icon ? 'pl-10' : 'pl-4'}
                    ${error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                        : 'border border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}
                    ${disabled ? 'bg-gray-50 text-gray-400' : 'text-gray-700 bg-white'}
                    ${className}`}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    name={name}
                    disabled={disabled}
                    required={required}
                    maxLength={maxLength}
                />
                {type === 'number' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="flex flex-col space-y-1">
                            <button className="focus:outline-none h-3 w-3 flex items-center justify-center" tabIndex={-1}>
                                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button className="focus:outline-none h-3 w-3 flex items-center justify-center" tabIndex={-1}>
                                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;