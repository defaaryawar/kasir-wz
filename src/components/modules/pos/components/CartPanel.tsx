import React from 'react';
import Card from '../../../common/Card';
import Button from '../../../common/Button';
import { OrderItem } from '../../../../interfaces';

interface CartPanelProps {
    cart: OrderItem[];
    discount: number;
    onDiscountChange: (discount: number) => void;  // Diubah dari setDiscount menjadi onDiscountChange
    onRemoveItem: (id: string) => void;  // Diubah dari removeFromCart menjadi onRemoveItem
    onUpdateQuantity: (id: string, quantity: number) => void;  // Diubah dari updateCartItemQuantity menjadi onUpdateQuantity
    subtotal: number;  // Diubah dari calculateSubtotal menjadi subtotal yang sudah dihitung
    total: number;  // Diubah dari calculateTotal menjadi total yang sudah dihitung
    onCheckout: () => void;  // Diubah dari openPaymentModal menjadi onCheckout
    onClearCart: () => void;  // Diubah dari clearCart menjadi onClearCart
    isCheckoutDisabled?: boolean;  // Ditambahkan property baru
}

const CartPanel: React.FC<CartPanelProps> = ({
    cart,
    discount,
    onDiscountChange,  // Diubah dari setDiscount
    onRemoveItem,  // Diubah dari removeFromCart
    onUpdateQuantity,  // Diubah dari updateCartItemQuantity
    subtotal,  // Subtotal langsung
    total,  // Total langsung
    onCheckout,  // Diubah dari openPaymentModal
    onClearCart,  // Diubah dari clearCart
    isCheckoutDisabled = false  // Default value
}) => {
    return (
        <Card title={
            <div className="flex items-center text-indigo-600">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-semibold">Pesanan</span>
                {cart.length > 0 && (
                    <span className="bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                        {cart.length}
                    </span>
                )}
            </div>
        }>
            {cart.length > 0 ? (
                <div className="rounded">
                    <div className="space-y-1.5 mb-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b pb-2 last:border-b-0 px-1 py-2"
                            >
                                <div className="flex-1">
                                    <div className="font-medium text-indigo-700 text-sm">{item.serviceName}</div>
                                    <div className="flex items-center mt-0.5">
                                        <span className="text-gray-600 text-xs">Rp {item.unitPrice.toLocaleString()}</span>
                                        <span className="mx-1 text-gray-400">×</span>
                                        <div className="flex border border-gray-200 rounded overflow-hidden">
                                            <button
                                                className="px-1 py-0 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs"
                                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                className="w-8 px-0 py-0 border-0 text-center text-xs focus:ring-0"
                                            />
                                            <button
                                                className="px-1 py-0 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs"
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end ml-2">
                                    <div className="font-semibold text-indigo-600 text-sm">
                                        Rp {item.subtotal.toLocaleString()}
                                    </div>
                                    <button
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        onClick={() => onRemoveItem(item.id)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 border-t pt-3 mt-1 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Diskon (%):</span>
                            <div className="relative w-16">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discount}
                                    onChange={(e) => onDiscountChange(parseInt(e.target.value) || 0)}
                                    className="w-full px-1.5 py-0.5 border rounded text-right text-sm focus:ring-1 focus:ring-indigo-500"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">%</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-semibold bg-indigo-50 p-2 rounded text-indigo-700 mt-2">
                            <span>Total:</span>
                            <span>Rp {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                        <Button
                            variant="success"
                            fullWidth
                            onClick={onCheckout}
                            disabled={isCheckoutDisabled}
                            className="py-1.5 text-sm"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Bayar
                        </Button>

                        <Button
                            variant="danger"
                            onClick={onClearCart}
                            className="py-1.5 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6 bg-indigo-50 rounded">
                    <svg className="w-16 h-16 mx-auto text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="mt-2 text-indigo-700 font-medium text-sm">Keranjang belanja kosong</p>
                    <p className="text-indigo-500 mt-1 text-xs">Pilih layanan untuk menambahkan ke keranjang</p>
                </div>
            )}
        </Card>
    );
};

export default CartPanel;