import React, { useState } from 'react';
import Card from '../../../common/Card';
import Select from '../../../common/Select';
import Button from '../../../common/Button';
import Input from '../../../common/Input';
import Modal from '../../../common/Modal';
import { Customer } from '../../../../interfaces';

interface CustomerPanelProps {
    customers: Customer[];
    selectedCustomer: Customer | null;
    onSelectCustomer: (customer: Customer | null) => void;
    onSearch: (term: string) => void;
    onCreateCustomer: (customer: Omit<Customer, 'id'>) => Promise<Customer>;
}

const CustomerPanel: React.FC<CustomerPanelProps> = ({ 
    customers, 
    selectedCustomer, 
    onSelectCustomer,
    onSearch,
    onCreateCustomer
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
        name: '',
        phone: '',
        address: '',
        email: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        phone?: string;
        address?: string;
        email?: string;
        general?: string;
    }>({});

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term);
    };

    const validatePhoneNumber = (phone: string): boolean => {
        // Only allow numbers, minimum 8 digits, maximum 15 digits
        const phoneRegex = /^[0-9]{8,15}$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email: string): boolean => {
        if (!email) return true; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const resetForm = () => {
        setNewCustomer({
            name: '',
            phone: '',
            address: '',
            email: ''
        });
        setValidationErrors({});
    };

    const handleCreateCustomer = async () => {
        // Validate all fields
        const errors: typeof validationErrors = {};
        
        if (!newCustomer.name.trim()) {
            errors.name = 'Nama wajib diisi';
        } else if (newCustomer.name.length < 3) {
            errors.name = 'Nama minimal 3 karakter';
        }
        
        if (!newCustomer.phone) {
            errors.phone = 'Nomor telepon wajib diisi';
        } else if (!validatePhoneNumber(newCustomer.phone)) {
            errors.phone = 'Nomor telepon harus terdiri dari 8-15 digit angka';
        }
        
        if (!newCustomer.address.trim()) {
            errors.address = 'Alamat wajib diisi';
        }
        
        if (newCustomer.email && !validateEmail(newCustomer.email)) {
            errors.email = 'Format email tidak valid';
        }
        
        setValidationErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsCreating(true);

        try {
            const createdCustomer = await onCreateCustomer(newCustomer);
            onSelectCustomer(createdCustomer);
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            console.error('Failed to create customer:', error);
            setValidationErrors({
                general: 'Gagal membuat pelanggan baru. Silakan coba lagi.'
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers
        const value = e.target.value.replace(/\D/g, '');
        setNewCustomer({...newCustomer, phone: value});
        
        // Clear validation error if field becomes valid
        if (validatePhoneNumber(value) && validationErrors.phone) {
            setValidationErrors({...validationErrors, phone: undefined});
        }
    };

    const handleInputChange = (field: keyof Omit<Customer, 'id'>, value: string) => {
        setNewCustomer({...newCustomer, [field]: value});
        
        // Clear respective validation error
        if (validationErrors[field]) {
            setValidationErrors({...validationErrors, [field]: undefined});
        }
    };

    return (
        <>
            <Card title={
                <div className="flex items-center text-purple-600">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-semibold">Pelanggan</span>
                </div>
            }>
                <div className="p-2">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-purple-600 mb-1">
                                Cari/Pilih Pelanggan
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <Input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Cari nama atau telepon"
                                />
                            </div>
                        </div>

                        <div className="md:self-end">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCreateModal(true)}
                                className="bg-white border border-purple-400 text-purple-600 hover:bg-purple-50 rounded py-1.5 px-3 text-sm flex items-center justify-center w-full md:w-auto"
                            >
                                <svg 
                                    className="w-4 h-4 mr-1" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Pelanggan Baru
                            </Button>
                        </div>
                    </div>

                    {customers.length > 0 && (
                        <div className="mt-2">
                            <label className="block text-xs font-medium text-purple-600 mb-1">
                                Daftar Pelanggan
                            </label>
                            <Select
                                value={selectedCustomer?.id || ''}
                                options={customers.map(customer => ({
                                    value: customer.id,
                                    label: `${customer.name} (${customer.phone})`
                                }))}
                                onChange={(e) => {
                                    const customer = customers.find(c => c.id === e.target.value);
                                    onSelectCustomer(customer || null);
                                }}
                            />
                        </div>
                    )}

                    {selectedCustomer ? (
                        <div className="mt-3 p-3 bg-white rounded border border-purple-100">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2 text-sm">
                                    {selectedCustomer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-medium text-purple-800">{selectedCustomer.name}</div>
                                    <div className="text-purple-500 text-xs">ID: {selectedCustomer.id}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center p-1.5 bg-purple-50 rounded text-sm">
                                    <svg className="w-3.5 h-3.5 text-purple-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <div className="text-xs text-purple-500">Telepon</div>
                                        <div className="font-medium text-xs">{selectedCustomer.phone}</div>
                                    </div>
                                </div>
                                
                                {selectedCustomer.address && (
                                    <div className="flex items-center p-1.5 bg-purple-50 rounded text-sm">
                                        <svg className="w-3.5 h-3.5 text-purple-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <div className="text-xs text-purple-500">Alamat</div>
                                            <div className="font-medium text-xs">{selectedCustomer.address}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-3 p-3 border border-dashed border-purple-200 rounded text-center text-purple-400 text-sm">
                            <svg className="w-8 h-8 mx-auto text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="mt-1">Silakan pilih pelanggan dari daftar</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Create Customer Modal - Improved Design */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
                title="Tambah Pelanggan Baru"
            >
                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            label="Nama Lengkap"
                            value={newCustomer.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            placeholder="Masukkan nama lengkap"
                            className={validationErrors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationErrors.name}
                            </p>
                        )}
                    </div>
                    
                    <div className="relative">
                        <div className="relative">
                            <Input
                                label="Nomor Telepon"
                                value={newCustomer.phone}
                                onChange={handlePhoneInput}
                                required
                                placeholder="Contoh: 081234567890"
                                className={validationErrors.phone ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
                                maxLength={15}
                            />
                            {!validationErrors.phone && (
                                <p className="mt-1 text-xs text-gray-500">Hanya angka, minimal 8 dan maksimal 15 digit</p>
                            )}
                        </div>
                        {validationErrors.phone && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationErrors.phone}
                            </p>
                        )}
                    </div>
                    
                    <div className="relative">
                        <Input
                            label="Alamat"
                            value={newCustomer.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            required
                            placeholder="Masukkan alamat lengkap"
                            className={validationErrors.address ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {validationErrors.address && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationErrors.address}
                            </p>
                        )}
                    </div>
                    
                    <div className="relative">
                        <Input
                            label="Email (Opsional)"
                            type="email"
                            value={newCustomer.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="contoh@email.com"
                            className={validationErrors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationErrors.email}
                            </p>
                        )}
                    </div>

                    {validationErrors.general && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-start">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{validationErrors.general}</span>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowCreateModal(false);
                                resetForm();
                            }}
                            disabled={isCreating}
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateCustomer}
                            disabled={isCreating}
                            className="bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
                        >
                            {isCreating ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : 'Simpan'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CustomerPanel;