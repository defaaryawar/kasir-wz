import { Order } from '../interfaces';

// Simulasi konfigurasi Midtrans
const MIDTRANS_CONFIG = {
    clientKey: 'YOUR_MIDTRANS_CLIENT_KEY',
    serverKey: 'YOUR_MIDTRANS_SERVER_KEY',
    isProduction: false,
    isSanitized: true,
    is3ds: true
};

// Fungsi untuk membuat transaksi Midtrans
export const createMidtransTransaction = async (order: Order, customerData: { name: string, email: string, phone: string }) => {
    try {
        // Pada implementasi sebenarnya, request ini akan dikirim ke backend
        // yang kemudian akan memanggil Midtrans API

        // Format item untuk Midtrans
        const items = order.items.map(item => ({
            id: item.serviceId,
            price: item.unitPrice,
            quantity: item.quantity,
            name: item.serviceName
        }));

        // Data transaksi
        const transactionData = {
            transaction_details: {
                order_id: order.id,
                gross_amount: order.finalAmount
            },
            item_details: items,
            customer_details: {
                first_name: customerData.name,
                email: customerData.email,
                phone: customerData.phone
            }
        };

        // Simulasikan panggilan API
        console.log('Sending transaction to Midtrans:', transactionData);

        // Simulasi respons dari Midtrans
        return {
            token: 'midtrans-mock-token-123456',
            redirect_url: 'https://app.midtrans.com/snap/v2/vtweb/mock-token'
        };
    } catch (error) {
        console.error('Error creating Midtrans transaction:', error);
        throw error;
    }
};

// Fungsi untuk memproses pembayaran Midtrans di client side
export const processPaymentWithMidtrans = async (snapToken: string) => {
    // Pada implementasi sebenarnya, fungsi ini akan memanggil Midtrans Snap
    // window.snap.pay(snapToken, { ... callbacks ... });

    // Simulasi pembayaran sukses
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 'success',
                transaction_id: `MIDTRANS-${Date.now()}`,
                order_id: `ORD-${Date.now()}`
            });
        }, 2000);
    });
};

// Fungsi untuk memeriksa status transaksi
export const checkTransactionStatus = async (orderId: string) => {
    // Simulasi pengecekan status
    return {
        transaction_status: 'settlement',
        fraud_status: 'accept',
        order_id: orderId
    };
};