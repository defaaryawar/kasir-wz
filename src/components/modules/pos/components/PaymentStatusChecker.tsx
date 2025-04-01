import { useEffect, useState } from 'react';
import axios from 'axios';

// Define an interface for the expected response shape
interface PaymentStatusResponse {
    paymentStatus: string;
}

const PaymentStatusChecker = ({ orderId }: { orderId: string }) => {
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Add the generic type parameter to axios.get
                const response = await axios.get<PaymentStatusResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/payment-status`
                );
                setStatus(response.data.paymentStatus);
            } catch (error) {
                console.error('Error checking payment status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus(); // Run immediately on mount
        const interval = setInterval(checkStatus, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [orderId]);

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            {isLoading ? (
                <p>Memeriksa status pembayaran...</p>
            ) : (
                <p>Status Pembayaran: {status}</p>
            )}
        </div>
    );
};

export default PaymentStatusChecker;