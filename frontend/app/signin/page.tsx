'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { apiConfig } from '@/app/config';

export default function AuthPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const payload = { email, password };
            const res = await axios.post(`${apiConfig.apiUrl}/user/signin`, payload);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            Swal.fire({ icon: 'success', title: 'Login success', timer: 1200, showConfirmButton: false });
            router.push(res.data.role === 'admin' ? '/backoffice/dashboard' : '/store');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'Invalid credentials',
                timer: 2000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const payload = { name, username, email, password };
            await axios.post(`${apiConfig.apiUrl}/user/register`, payload);
            Swal.fire({ icon: 'success', title: 'Register success', timer: 1500, showConfirmButton: false });
            setIsRegister(false);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Register Failed',
                text: error.response?.data?.message || 'Something went wrong',
                timer: 2000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <div className="relative w-1/2 h-full">
                <Image src="/assets/images/background.jpg" alt="bg" fill className="object-cover brightness-[.4] contrast-[0.8] saturate-[0.5]" />
            </div>

            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-800 text-gray-100">
                <div className="flex flex-col w-full max-w-md p-6">
                    <div className="flex justify-center mb-6">
                        <Image src="/assets/images/logo.png" alt="logo" width={150} height={150} className="object-contain invert-[1]" />
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-center mb-6">
                            {isRegister ? 'Create Account' : 'Login to your account'}
                        </h1>

                        {loading && (
                            <div className="space-y-2 mb-4">
                                {[...Array(isRegister ? 4 : 2)].map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-600 rounded animate-pulse" />
                                ))}
                            </div>
                        )}

                        {!loading && (
                            <>
                                {isRegister && (
                                    <>
                                        <input type="text" placeholder="Full Name" className="input-field bg-gray-700 text-gray-100" onChange={e => setName(e.target.value)} />
                                        <input type="text" placeholder="Username" className="input-field bg-gray-700 text-gray-100" onChange={e => setUsername(e.target.value)} />
                                    </>
                                )}

                                <input type="email" placeholder="Email" className="input-field bg-gray-700 text-gray-100" onChange={e => setEmail(e.target.value)} />
                                <input type="password" placeholder="Password" className="input-field bg-gray-700 text-gray-100" onChange={e => setPassword(e.target.value)} />

                                <button
                                    className={`mt-6 py-2 rounded-md font-semibold text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'} transition`}
                                    onClick={isRegister ? handleRegister : handleLogin}
                                    disabled={loading}
                                >
                                    {isRegister ? 'Register' : 'Login'}
                                </button>

                                <button
                                    className="mt-2 text-sm text-gray-300 hover:text-gray-100 underline"
                                    onClick={() => setIsRegister(!isRegister)}
                                >
                                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
