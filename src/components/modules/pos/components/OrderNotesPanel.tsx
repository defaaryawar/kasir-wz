import React from 'react';
import Card from '../../../common/Card';

interface OrderNotesPanelProps {
    note: string;
    onNoteChange: (note: string) => void;  // Diubah dari setNote menjadi onNoteChange
}

const OrderNotesPanel: React.FC<OrderNotesPanelProps> = ({
    note,
    onNoteChange  // Diubah dari setNote menjadi onNoteChange
}) => {
    return (
        <Card title="Catatan Pesanan">
            <div className="relative">
                <textarea
                    className="w-full px-4 py-3 border-0 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 resize-none shadow-sm"
                    rows={4}
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}  // Diubah dari setNote menjadi onNoteChange
                    placeholder="Tambahkan catatan pesanan di sini..."
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {note.length} karakter
                </div>
            </div>
        </Card>
    );
};

export default OrderNotesPanel;