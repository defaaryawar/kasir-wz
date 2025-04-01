import React from 'react';
import Button from '../../../common/Button';
import Input from '../../../common/Input';
import Select from '../../../common/Select';

interface PaymentModalProps {
    totalAmount: number;
    paymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
    paymentAmount: string;
    onPaymentAmountChange: (amount: string) => void;
    changeAmount: number;
    isPaymentValid: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    totalAmount,
    paymentMethod,
    onPaymentMethodChange,
    paymentAmount,
    onPaymentAmountChange,
    changeAmount,
    isPaymentValid,
    isLoading,
    onClose,
    onConfirm
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Pembayaran</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Total Pembayaran
                        </label>
                        <div className="text-3xl font-bold text-gray-800">
                            Rp {totalAmount.toLocaleString('id-ID')}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Metode Pembayaran
                        </label>
                        <Select
                            value={paymentMethod}
                            options={[
                                { value: 'cash', label: 'Tunai' },
                                { value: 'transfer', label: 'Transfer Bank' },
                                { value: 'midtrans', label: 'Midtrans (QRIS/E-Wallet/CC)' },
                            ]}
                            onChange={(e) => onPaymentMethodChange(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {paymentMethod === 'cash' && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Jumlah Dibayar (Rp)
                                </label>
                                <Input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => onPaymentAmountChange(e.target.value)}
                                    placeholder="Masukkan jumlah uang"
                                    disabled={isLoading}
                                />
                            </div>

                            {paymentAmount && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Total:</span>
                                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Kembalian:</span>
                                        <span className={!isPaymentValid ? 'text-red-500' : 'text-green-600'}>
                                            Rp {changeAmount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {paymentMethod === 'transfer' && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <p>Lakukan transfer ke rekening BCA 1234567890 a.n. Laundry Kami</p>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'midtrans' && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    {/* <CreditCardIcon className="h-5 w-5 text-blue-600" /> */}
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-800">Pembayaran via Midtrans</h4>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Anda akan diarahkan ke halaman pembayaran Midtrans untuk memilih metode pembayaran (QRIS, E-Wallet, Kartu Kredit, dll)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        disabled={isLoading || (paymentMethod === 'cash' && !isPaymentValid)}
                        className="min-w-[120px]"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </span>
                        ) : 'Bayar Sekarang'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;