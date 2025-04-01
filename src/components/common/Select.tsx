import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
    name?: string;
    disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
    options,
    label,
    value,
    onChange,
    error,
    required = false,
    name,
    disabled = false,
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
                <select
                    className={`w-full px-4 py-2.5 appearance-none bg-white border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2
                    ${error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}
                    ${disabled ? 'bg-gray-50 text-gray-400' : 'text-gray-700'}`}
                    value={value}
                    onChange={onChange}
                    name={name}
                    disabled={disabled}
                    required={required}
                >
                    <option value="">Pilih opsi</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Select;