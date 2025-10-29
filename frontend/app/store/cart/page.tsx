'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(saved);
    }, []);

    const removeItem = (id: number) => {
        const updated = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updated));
        setCart(updated);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="store-container px-8 sm:px-16 py-10"
        >
            <h1 className="text-3xl font-bold mb-6 text-gray-900">ตะกร้าสินค้า</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <ul className="divide-y divide-gray-200">
                        {cart.map((item) => (
                            <li key={item.id} className="flex justify-between py-4">
                                <span className="font-medium text-gray-800">
                                    {item.name} (x{item.quantity})
                                </span>
                                <div>
                                    <span className="text-indigo-600 font-semibold">
                                        {item.price * item.quantity}฿
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="ml-3 text-red-500 hover:underline"
                                    >
                                        ลบ
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-end mt-6">
                        <div className="flex flex-col items-end">
                            <p className="font-bold text-lg text-gray-900 mb-2">
                                รวมทั้งหมด: <span className="text-indigo-600">{total}฿</span>
                            </p>
                            <Link href="/store/checkout">
                                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                                    ไปชำระเงิน
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}