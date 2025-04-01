import React from 'react';
import Layout from '../components/layout/Layout';
import POSScreen from '../components/modules/pos/POSScreen';

const POSPage: React.FC = () => {
    return (
        <Layout>
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Kasir Warung Zafran Laundry</h1>
                <p className="text-gray-600">Kelola transaksi pelanggan dengan mudah</p>
            </div>

            <POSScreen />
        </Layout>
    );
};

export default POSPage;