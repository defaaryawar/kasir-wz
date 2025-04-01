export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string | any;
}

export interface ServiceItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
}

export interface OrderItem {
    id: string;
    serviceId: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    items: OrderItem[];
    totalAmount: number;
    discount?: number;
    tax?: number;
    finalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'partial' | 'pending';
    paymentMethod?: string;
    paymentId?: string;
    createdAt: Date | string;
    updatedAt: Date;
    notes?: string;
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: 'pending' | 'success' | 'failed';
    transactionId: string;
    createdAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'cashier';
}

export interface Report {
    startDate: Date;
    endDate: Date;
    totalSales: number;
    totalOrders: number;
    paymentMethods: {
        method: string;
        count: number;
        amount: number;
    }[];
    topServices: {
        serviceId: string;
        serviceName: string;
        count: number;
        amount: number;
    }[];
}