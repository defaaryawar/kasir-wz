import React from 'react';
import Card from '../../../common/Card';
import Input from '../../../common/Input';
import { ServiceItem } from '../../../../interfaces';

interface ServicesPanelProps {
    groupedServices: Record<string, ServiceItem[]>;
    searchTerm: string;
    onSearchChange: (term: string) => void;  // Diubah dari setSearchTerm menjadi onSearchChange
    onAddToCart: (service: ServiceItem) => void;  // Diubah dari addToCart menjadi onAddToCart
    currentQuantity: number;  // Ditambahkan property baru
    onQuantityChange: (quantity: number) => void;  // Ditambahkan property baru
}

const ServicesPanel: React.FC<ServicesPanelProps> = ({
    groupedServices,
    searchTerm,
    onSearchChange,  // Diubah dari setSearchTerm menjadi onSearchChange
    onAddToCart,  // Diubah dari addToCart menjadi onAddToCart
    // currentQuantity,  // Ditambahkan parameter baru
    // onQuantityChange  // Ditambahkan parameter baru
}) => {
    return (
        <Card title="Layanan Laundry">
            <div className="mb-3">
                <Input
                    label="Cari Layanan"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}  // Diubah dari setSearchTerm menjadi onSearchChange
                    placeholder="Ketik nama atau kategori layanan..."
                />
            </div>
            
            {/* Menambahkan input kuantitas
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kuantitas</label>
                <div className="flex border border-gray-300 rounded-md overflow-hidden w-32">
                    <button 
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        onClick={() => onQuantityChange(Math.max(1, currentQuantity - 1))}
                    >
                        -
                    </button>
                    <input 
                        type="number"
                        min="1"
                        value={currentQuantity}
                        onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-full border-0 focus:ring-0 text-center"
                    />
                    <button 
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        onClick={() => onQuantityChange(currentQuantity + 1)}
                    >
                        +
                    </button>
                </div>
            </div> */}
            
            {Object.keys(groupedServices).length > 0 ? (
                <div className="space-y-4">
                    {Object.entries(groupedServices).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="font-medium text-gray-700 text-sm mb-2">{category}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {items.map(service => (
                                    <div
                                        key={service.id}
                                        className="border rounded-md p-2 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm"
                                        onClick={() => onAddToCart(service)}  // Diubah dari addToCart menjadi onAddToCart
                                    >
                                        <div className="font-medium text-sm truncate">{service.name}</div>
                                        <div className="text-xs text-gray-500">{service.category}</div>
                                        <div className="mt-1 font-bold text-blue-600 text-sm">Rp {service.price.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                    Tidak ada layanan yang ditemukan
                </div>
            )}
        </Card>
    );
};

export default ServicesPanel;