'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { apiConfig } from '@/app/config';
import dayjs from 'dayjs';

interface User {
    id: number;
    name: string;
    email: string;
    username?: string;
    avatar?: string;
    joinedDate?: string;
    password?: string;
}

interface Order {
    id: number;
    createdAt: string;
    totalPrice: number;
    status: string;
}

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // fetch user + orders
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเข้าสู่ระบบก่อน',
                confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
            }).then(() => router.push('/signin'));
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                // fetch user info
                const userRes = await axios.get(`${apiConfig.apiUrl}/user/info`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                // fetch orders using fetched user id
                const ordersRes = await axios.get(`${apiConfig.apiUrl}/order/user/${userRes.data.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(ordersRes.data);
            } catch (error) {
                console.error('Error fetching user/account data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]); // ✅ แค่ router


    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        Swal.fire({ icon: 'success', title: 'ออกจากระบบสำเร็จ', timer: 1200, showConfirmButton: false });
        router.push('/signin');
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.put(`${apiConfig.apiUrl}/user/updateProfile/${user?.id}`, user, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire({ icon: 'success', title: 'Profile updated', timer: 1200, showConfirmButton: false });
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'Update Failed', text: error.response?.data?.message || 'Something went wrong' });
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-700 to-gray-800 text-gray-100 px-6 md:px-20 py-10 rounded-xl">
            <h1 className="text-3xl font-bold mb-8 text-center">My Account</h1>

            {/* Tabs */}
            <div className="flex justify-center mb-10 space-x-4">
                {['profile', 'orders', 'settings'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === tab
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="max-w-5xl mx-auto bg-gray-700 rounded-2xl shadow-lg p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-6 bg-gray-600 rounded w-full animate-pulse"></div>
                            ))}
                        </motion.div>
                    ) : activeTab === 'profile' ? (
                        <motion.div key="profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                            {user && (
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-400">
                                        <Image src={user.avatar || '/assets/images/avatar-default.png'} alt="avatar" fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{user.name}</h2>
                                        <p className="text-gray-300">{user.email}</p>
                                        <p className="text-gray-400 mt-2">Username: {user.username}</p>
                                        <button onClick={handleLogout} className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold text-white transition">Logout</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : activeTab === 'orders' ? (
                        <motion.div key="orders" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                            <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                            {orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-600 text-gray-300">
                                                <th className="py-3 px-4">Order ID</th>
                                                <th className="py-3 px-4">Date</th>
                                                <th className="py-3 px-4">Total</th>
                                                <th className="py-3 px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id} className="border-b border-gray-600 hover:bg-gray-600/50 transition">
                                                    <td className="py-3 px-4">{order.id}</td>
                                                    <td className="py-3 px-4">{dayjs(order.createdAt).format("DD/MM/YYYY, HH:mm")}</td>
                                                    <td className="py-3 px-4">{order.totalPrice}฿</td>
                                                    <td className={`py-3 px-4 font-semibold ${order.status === 'Delivered' ? 'text-green-400' : 'text-yellow-300'}`}>{order.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : <p className="text-center text-gray-400">No orders found yet.</p>}
                        </motion.div>
                    ) : (
                        <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                            <form className="space-y-4 max-w-md" onSubmit={handleProfileUpdate}>
                                <div>
                                    <label className="block text-gray-300 mb-1">Name</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100" value={user?.name || ''} onChange={e => setUser({ ...user!, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Username</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100" value={user?.username || ''} onChange={e => setUser({ ...user!, username: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Email</label>
                                    <input type="email" className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100" value={user?.email || ''} onChange={e => setUser({ ...user!, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Password</label>
                                    <input type="password" className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100" placeholder="Enter new password" onChange={e => setUser({ ...user!, password: e.target.value })} />
                                </div>
                                <button type="submit" className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-md transition">Save Changes</button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
