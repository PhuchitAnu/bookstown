'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { apiConfig } from '@/app/config';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import generatePayload from 'promptpay-qr';
import QRCode from 'qrcode';
import Image from 'next/image';

export default function CheckoutPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [step, setStep] = useState<'qr' | 'upload' | 'shipping'>('qr');
    const [qr, setQr] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [slip, setSlip] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(saved);
        const totalAmount = saved.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);

        const payload = generatePayload('0993212240', { amount: totalAmount });
        QRCode.toDataURL(payload).then(setQr);
    }, []);

    const handleCheckout = async () => {
        if (!name || !address || !phone) {
            Swal.fire('โปรดกรอกข้อมูลให้ครบถ้วน');
            return;
        }

        try {
            const token = localStorage.getItem('token');;
            if (!token) return Swal.fire('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');

            const decoded: any = JSON.parse(atob(token.split('.')[1]));
            const userId = decoded.id;
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const payload = {
                userId,
                shippingName: name,
                shippingAddress: address,
                shippingPhone: phone,
                items: cart,
                totalPrice: total,
            };

            await axios.post(`${apiConfig.apiUrl}/order/create`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.removeItem('cart');
            Swal.fire('สั่งซื้อสำเร็จ', 'ขอบคุณที่ใช้บริการ', 'success');
            router.push('/store');
        } catch (error: any) {
            Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
        }
    };

    const handleSlipVerification = async () => {
        if (!slip) return Swal.fire('กรุณาอัปโหลดสลิป');

        const formData = new FormData();
        formData.append('file', slip);
        formData.append('amount', total.toString());

        try {
            const res = await axios.post(`${apiConfig.apiUrl}/payment/verify-slip`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.status === 'success') {
                Swal.fire('ตรวจสอบสลิปสำเร็จ', 'โปรดกรอกข้อมูลจัดส่ง', 'success');
                setStep('shipping');
            } else {
                Swal.fire('สลิปไม่ถูกต้อง', res.data.message || '', 'error');
            }
        } catch (err: any) {
            Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="store-container px-8 sm:px-20 py-10"
        >
            {step === 'qr' && (
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">สแกนเพื่อชำระเงิน</h2>
                    {qr &&
                        <Image
                            src={qr}
                            alt="PromptPay QR"
                            width={200}
                            height={200}
                            className="mx-auto mb-4"
                        />}
                    <p className="text-gray-600 mb-2">ยอดชำระรวม: {total.toFixed(2)} บาท</p>

                    <button
                        onClick={() => setStep('upload')}
                        className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        ฉันได้ชำระเงินแล้ว
                    </button>
                </div>
            )}

            {step === 'upload' && (
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-xl font-semibold mb-4">อัปโหลดสลิปชำระเงิน</h2>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSlip(e.target.files?.[0] || null)}
                        className="file-input w-full mb-4"
                    />
                    <button
                        onClick={handleSlipVerification}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        ตรวจสอบสลิป
                    </button>
                </div>
            )}

            {step === 'shipping' && (
                <div className="bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="ชื่อผู้รับ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="text"
                        placeholder="ที่อยู่จัดส่ง"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="text"
                        placeholder="เบอร์โทร"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        ยืนยันคำสั่งซื้อ
                    </button>
                </div>
            )}

        </motion.div>
    );
}