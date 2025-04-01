import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServicesPanel from './components/ServicesPanel';
import CustomerPanel from './components/CustomerPanel';
import OrderNotesPanel from './components/OrderNotesPanel';
import CartPanel from './components/CartPanel';
import PaymentModal from './components/PaymentModal';
import { Customer, ServiceItem, OrderItem, Order } from '../../../interfaces';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const POSScreen: React.FC = () => {
    // State for data and UI
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState<{
        type: 'info' | 'success' | 'error' | 'warning';
        text: string;
    } | null>(null);
    const [loading, setLoading] = useState({
        services: true,
        customers: true
    });
    const [error, setError] = useState({
        services: '',
        customers: ''
    });

    // Fetch data from backend API
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch active services
                const [servicesRes, customersRes] = await Promise.all([
                    axios.get<ServiceItem[]>(`${API_BASE_URL}/services`, {
                        params: { active: true }
                    }),
                    axios.get<Customer[]>(`${API_BASE_URL}/customers`)
                ]);

                setServices(servicesRes.data);
                setCustomers(customersRes.data);
                setError({ services: '', customers: '' });
            } catch (err) {
                console.error('Failed to fetch initial data:', err);
                setError({
                    services: 'Gagal memuat daftar layanan',
                    customers: 'Gagal memuat daftar pelanggan'
                });
            } finally {
                setLoading({ services: false, customers: false });
            }
        };

        fetchInitialData();
    }, []);

    // Search customers by name or phone
    const searchCustomers = async (term: string) => {
        try {
            setLoading(prev => ({ ...prev, customers: true }));
            const response = await axios.get<Customer[]>(`${API_BASE_URL}/customers/search`, {
                params: { term }
            });
            setCustomers(response.data);
            setError(prev => ({ ...prev, customers: '' }));
        } catch (err) {
            console.error('Failed to search customers:', err);
            setError(prev => ({ ...prev, customers: 'Gagal mencari pelanggan' }));
        } finally {
            setLoading(prev => ({ ...prev, customers: false }));
        }
    };

    // Create new customer if not exists
    const createCustomer = async (customerData: Omit<Customer, 'id'>) => {
        try {
            const response = await axios.post<Customer>(`${API_BASE_URL}/customers`, customerData);
            setCustomers(prev => [...prev, response.data]);
            setSelectedCustomer(response.data);
            return response.data;
        } catch (err) {
            console.error('Failed to create customer:', err);
            throw new Error('Gagal membuat pelanggan baru');
        }
    };

    // Filter services based on search term
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group services by category
    const groupedServices = filteredServices.reduce((groups, service) => {
        const category = service.category || 'Lainnya';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(service);
        return groups;
    }, {} as Record<string, ServiceItem[]>);

    // Add service to cart
    const addToCart = (service: ServiceItem) => {
        const existingItem = cart.find(item => item.serviceId === service.id);

        if (existingItem) {
            // Update existing item quantity
            setCart(cart.map(item =>
                item.id === existingItem.id
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        subtotal: item.unitPrice * (item.quantity + quantity)
                    }
                    : item
            ));
        } else {
            // Add new item to cart
            const newItem: OrderItem = {
                id: Date.now().toString(),
                serviceId: service.id,
                serviceName: service.name,
                quantity,
                unitPrice: service.price,
                subtotal: service.price * quantity,
            };
            setCart([...cart, newItem]);
        }

        setQuantity(1);
    };

    // Remove item from cart
    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // Update item quantity in cart
    const updateCartItemQuantity = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            return;
        }

        setCart(cart.map(item =>
            item.id === id
                ? {
                    ...item,
                    quantity: newQuantity,
                    subtotal: item.unitPrice * newQuantity
                }
                : item
        ));
    };

    // Calculate order totals
    const calculateSubtotal = () => cart.reduce((sum, item) => sum + item.subtotal, 0);
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal - (subtotal * (discount / 100));
    };
    const calculateChange = () => {
        const payment = parseFloat(paymentAmount) || 0;
        return payment - calculateTotal();
    };

    // Validate payment
    const validatePayment = () => {
        if (!selectedCustomer) {
            throw new Error('Pilih pelanggan terlebih dahulu');
        }
        if (cart.length === 0) {
            throw new Error('Keranjang belanja kosong');
        }
        if (!paymentMethod) {
            throw new Error('Pilih metode pembayaran');
        }
        if (paymentMethod === 'cash' && calculateChange() < 0) {
            throw new Error('Jumlah pembayaran kurang dari total');
        }
    };

    // Handle Midtrans payment method
    const handleMidtransPayment = async () => {
        try {
            setProcessingPayment(true);
            const response = await axios.post<{
                paymentUrl: string,
                orderId: string,
                // Add other properties returned by your API
            }>(`${API_BASE_URL}/orders`, {
                customerId: selectedCustomer?.id,
                items: cart.map(item => ({
                    serviceId: item.serviceId,
                    serviceName: item.serviceName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),
                totalAmount: calculateSubtotal(),
                discount,
                finalAmount: calculateTotal(),
                paymentMethod: 'midtrans',
                notes: note
            });

            if (response.data.paymentUrl) {
                // Open in new tab
                window.open(response.data.paymentUrl, '_blank');

                // Create a complete Order object that matches your interface
                const newOrder: Order = {
                    id: response.data.orderId,
                    paymentStatus: 'pending', // Ensure this matches your Order interface
                    customerId: selectedCustomer?.id || '',
                    customerName: selectedCustomer?.name || '',
                    totalAmount: calculateSubtotal(),
                    discount,
                    finalAmount: calculateTotal(),
                    status: 'pending',
                    paymentMethod: 'midtrans',
                    notes: note,
                    createdAt: new Date(), // Date object
                    updatedAt: new Date(), // Don't forget this required field
                    items: cart.map(item => ({
                        id: item.id,
                        orderId: response.data.orderId,
                        serviceId: item.serviceId,
                        serviceName: item.serviceName,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        subtotal: item.subtotal
                        // Include all required item properties
                    }))
                };

                setCurrentOrder(newOrder);

                setPaymentMessage({
                    type: 'info',
                    text: 'Pembayaran dibuka di tab baru. Anda dapat menutup jendela ini setelah selesai.'
                });

                setShowPaymentModal(false);
            }
        } catch (error) {
            console.error('Midtrans payment error:', error);
            setPaymentMessage({
                type: 'error',
                text: 'Gagal memproses pembayaran Midtrans. Silakan coba lagi.'
            });
        } finally {
            setProcessingPayment(false);
        }
    };

    // Process payment for all methods
    const processPayment = async () => {
        try {
            validatePayment();
            setProcessingPayment(true);

            if (paymentMethod === 'midtrans') {
                await handleMidtransPayment();
                return;
            }

            const orderData = {
                customerId: selectedCustomer!.id,
                items: cart.map(item => ({
                    serviceId: item.serviceId,
                    serviceName: item.serviceName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),
                totalAmount: calculateSubtotal(),
                discount,
                finalAmount: calculateTotal(),
                paymentMethod,
                notes: note,
                status: 'pending',
                paymentStatus: paymentMethod === 'cash' ? 'paid' : 'pending'
            };

            const response = await axios.post<Order>(`${API_BASE_URL}/orders`, orderData);
            setCurrentOrder(response.data);

            setPaymentMessage({
                type: 'success',
                text: `Order #${response.data.id} berhasil dibuat!`
            });

            if (paymentMethod === 'cash') {
                resetOrder();
            }

        } catch (error) {
            console.error('Payment processing error:', error);
            setPaymentMessage({
                type: 'error',
                text: error instanceof Error
                    ? error.message || 'Gagal memproses pembayaran'
                    : 'Gagal memproses pembayaran'
            });
        } finally {
            setProcessingPayment(false);
            setShowPaymentModal(false);
        }
    };

    // Reset order state
    const resetOrder = () => {
        setCart([]);
        setSelectedCustomer(null);
        setNote('');
        setDiscount(0);
        setPaymentMethod('');
        setPaymentAmount('');
    };

    // Check payment status periodically for pending orders
    useEffect(() => {
        if (!currentOrder || currentOrder.paymentStatus !== 'pending') return;

        const checkPaymentStatus = async () => {
            try {
                const response = await axios.get<{
                    paymentStatus: string;
                    status: string;
                }>(`${API_BASE_URL}/orders/${currentOrder.id}/payment-status`);

                if (response.data.paymentStatus === 'paid') {
                    setPaymentMessage({
                        type: 'success',
                        text: `Pembayaran untuk Order #${currentOrder.id} berhasil!`
                    });
                    resetOrder();
                    setCurrentOrder(null);
                }
            } catch (error) {
                console.error('Error checking payment:', error);
            }
        };

        const interval = setInterval(checkPaymentStatus, 15000);
        return () => clearInterval(interval);
    }, [currentOrder]);

    // Clear cart with confirmation
    const clearCart = () => {
        if (cart.length > 0 && window.confirm('Yakin ingin mengosongkan keranjang?')) {
            setCart([]);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gray-50 min-h-screen relative">
            {/* Payment Status Message */}
            {paymentMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${paymentMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                    paymentMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                        paymentMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                    }`}>
                    <div className="flex justify-between items-center">
                        <span>{paymentMessage.text}</span>
                        <button
                            onClick={() => setPaymentMessage(null)}
                            className="ml-4 text-lg font-bold"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {/* Left Panel - Services and Customer */}
            <div className="lg:col-span-2 space-y-4">
                {/* Services Panel */}
                <div className="bg-white rounded-lg shadow p-4">
                    {loading.services ? (
                        <div className="text-center py-8">Memuat daftar layanan...</div>
                    ) : error.services ? (
                        <div className="text-red-500 p-4 bg-red-50 rounded">
                            {error.services}
                            <button
                                onClick={() => window.location.reload()}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                Coba lagi
                            </button>
                        </div>
                    ) : (
                        <ServicesPanel
                            groupedServices={groupedServices}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onAddToCart={addToCart}
                            currentQuantity={quantity}
                            onQuantityChange={setQuantity}
                        />
                    )}
                </div>

                {/* Customer Panel */}
                <div className="bg-white rounded-lg shadow p-4">
                    {loading.customers ? (
                        <div className="text-center py-8">Memuat daftar pelanggan...</div>
                    ) : error.customers ? (
                        <div className="text-red-500 p-4 bg-red-50 rounded">
                            {error.customers}
                            <button
                                onClick={() => window.location.reload()}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                Coba lagi
                            </button>
                        </div>
                    ) : (
                        <CustomerPanel
                            customers={customers}
                            selectedCustomer={selectedCustomer}
                            onSelectCustomer={setSelectedCustomer}
                            onSearch={searchCustomers}
                            onCreateCustomer={createCustomer}
                        />
                    )}
                </div>

                {/* Order Notes */}
                <OrderNotesPanel
                    note={note}
                    onNoteChange={setNote}
                />
            </div>

            {/* Right Panel - Cart */}
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <CartPanel
                    cart={cart}
                    discount={discount}
                    onDiscountChange={setDiscount}
                    onRemoveItem={removeFromCart}
                    onUpdateQuantity={updateCartItemQuantity}
                    subtotal={calculateSubtotal()}
                    total={calculateTotal()}
                    onCheckout={() => setShowPaymentModal(true)}
                    onClearCart={clearCart}
                    isCheckoutDisabled={!selectedCustomer || cart.length === 0}
                />
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    totalAmount={calculateTotal()}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    paymentAmount={paymentAmount}
                    onPaymentAmountChange={setPaymentAmount}
                    changeAmount={calculateChange()}
                    isPaymentValid={calculateChange() >= 0}
                    isLoading={processingPayment}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={processPayment}
                />
            )}
        </div>
    );
};

export default POSScreen;