'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiConfig } from '@/app/config';
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import Modal from '../modal';

export default function Page() {
    const [orders, setOrders] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('Pending');
    const [id, setId] = useState(0);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                status: status,
            }
            await axios.put(`${apiConfig.apiUrl}/order/update/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setId(0);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
                text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
                timer: 2000,
                confirmButtonText: 'ตกลง',
            })
            handleCloseModal();
            fetchData();
        } catch (error: any) {
            console.log(error.massage);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้',
                timer: 2000,
                confirmButtonText: 'ตกลง',
            })
        }
    };

    const handleEdit = (id: any) => {
        const order = orders.find((order: any) => order.id === id) as any;
        setId(order.id);
        setStatus(order.status);
        handleOpenModal();
    }


    const handleOpenModal = () => {
        setIsOpen(true);
    }
    const handleCloseModal = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiConfig.apiUrl}/order/list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error: any) {
            console.log(error.massage);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถโหลดข้อมูลได้',
                timer: 2000,
            })
        }
    };

    return (
        <div>

            <h1 className='content-header'>Backoffice Orders</h1>

            <div className="max-h-[85vh] overflow-y-auto">
                <table className='w-full'>
                    <thead className='bg-gray-500 text-white'>
                        <tr>
                            <th className='product-th'>หมายเลขคำสั่งซื้อ</th>
                            <th className='product-th'>ชื่อผู้สั่งซื้อ</th>
                            <th className='product-th'>สินค้าที่อยู่ในออเดอร์</th>
                            <th className='product-th'>ราคาทั้งหมด</th>
                            <th className='product-th'>สถานะคำสั่งซื้อ</th>
                            <th className='product-th'>ที่อยู่จัดส่ง</th>
                            <th className='product-th'>เบอร์ติดต่อ</th>
                            <th className='product-th'>วันที่สั่งซื้อ</th>
                            <th className='product-th w-[50px]'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: any) => (
                            <tr className='product-tr' key={order.id}>
                                <td className='product-td'>{order.id}</td>
                                <td className='product-td'>{order.shippingName}</td>
                                <td className='product-td'>
                                    {order.items.map((item: any) => (
                                        <div key={item.id}>
                                            {item.book.name} × {item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td className='product-td'>฿ {order.totalPrice}</td>
                                <td className='product-td'>{order.status}</td>
                                <td className='product-td'>{order.shippingAddress}</td>
                                <td className='product-td'>{order.shippingPhone}</td>
                                <td className='product-td'>
                                    {dayjs(order.createdAt).format("DD/MM/YYYY,HH:mm")}
                                </td>
                                <td className='product-td'>
                                    <button className='edit-btn' onClick={() => handleEdit(order.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M19.09 14.441v4.44a2.37 2.37 0 0 1-2.369 2.369H5.12a2.37 2.37 0 0 1-2.369-2.383V7.279a2.356 2.356 0 0 1 2.37-2.37H9.56" /><path d="M6.835 15.803v-2.165c.002-.357.144-.7.395-.953l9.532-9.532a1.36 1.36 0 0 1 1.934 0l2.151 2.151a1.36 1.36 0 0 1 0 1.934l-9.532 9.532a1.36 1.36 0 0 1-.953.395H8.197a1.36 1.36 0 0 1-1.362-1.362M19.09 8.995l-4.085-4.086" /></g></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="Edit Status" isOpen={isOpen} onClose={handleCloseModal}>
                <div>สถานะ</div>
                <select className='mt-1 border border-gray-800 rounded-lg p-1' value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <div className='mt-4'>
                    <button className='summit-btn flex' onClick={handleSave}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='mr-1'><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h11.175q.4 0 .763.15t.637.425l2.85 2.85q.275.275.425.638t.15.762V19q0 .825-.587 1.413T19 21zM19 7.85L16.15 5H5v14h14zM12 18q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-5-8h7q.425 0 .713-.288T15 9V7q0-.425-.288-.712T14 6H7q-.425 0-.712.288T6 7v2q0 .425.288.713T7 10M5 7.85V19V5z" strokeWidth="0.5" stroke="currentColor" /></svg>
                        บันทึก
                    </button>
                </div>
            </Modal>

        </div>
    );
}