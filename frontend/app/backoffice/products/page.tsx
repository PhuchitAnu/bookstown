'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiConfig } from '@/app/config';
import Swal from 'sweetalert2';
import Modal from '../modal';
import Image from 'next/image';

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [isbn, setIsbn] = useState('');
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [fullPrice, setFullPrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [status, setStatus] = useState('Instock');
    const [imageUrl, setImageUrl] = useState('');
    const [id, setId] = useState(0);

    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiConfig.apiUrl}/book/list`);
            setBooks(response.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถโหลดข้อมูลได้',
                timer: 2000,
            })
        }
    };

    const handleOpenModal = () => {
        setIsOpen(true);
    }
    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                isbn: isbn,
                name: name,
                author: author,
                year: year,
                description: description,
                category: category,
                imageUrl: imageUrl,
                quantity: quantity,
                fullPrice: fullPrice,
                price: price,
                status: status,
            }
            if (id === 0) {
                await axios.post(`${apiConfig.apiUrl}/book/create`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.put(`${apiConfig.apiUrl}/book/update/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setId(0);
            }
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
                text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
                timer: 2000,
                confirmButtonText: 'ตกลง',
            })
            handleCloseModal();
            fetchData();
        } catch (error) {
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
        const book = books.find((book: any) => book.id === id) as any;
        setIsbn(book.isbn);
        setName(book.name);
        setAuthor(book.author);
        setYear(book.year);
        setDescription(book.description);
        setCategory(book.category);
        setImageUrl(book.imageUrl);
        setQuantity(book.quantity);
        setFullPrice(book.fullPrice);
        setPrice(book.price);
        setId(book.id);
        setStatus(book.status);
        handleOpenModal();
    }

    const handleDelete = async (id: any) => {
        try {
            const button = await Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
                icon: 'warning',
                showConfirmButton: true,
                showCancelButton: true,
            });
            if (button.isConfirmed) {
                await axios.delete(`${apiConfig.apiUrl}/book/delete/${id}`);
                fetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'ลบข้อมูลสำเร็จ',
                    text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
                    timer: 2000,
                    confirmButtonText: 'ตกลง',
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถลบข้อมูลได้',
                timer: 2000,
                confirmButtonText: 'ตกลง',
            })
        }
    }

    const handleFileUpload = async (e: any) => {
        const file = e.target.files[0];

        if (!file) return

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'bookstown');
        formData.append('cloud_name', 'df54wzjtr');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/df54wzjtr/image/upload', formData);
            setImageUrl(response.data.url);
        } catch (error) {
            console.log(error);
        }

    }

    const handleClear = () => {
        setIsbn('');
        setName('');
        setAuthor('');
        setYear('');
        setDescription('');
        setCategory('');
        setImageUrl('');
        setQuantity(0);
        setFullPrice(0);
        setPrice(0);
        setStatus('Instock');
    }


    return (
        <div>
            <h1 className='content-header'>Backoffice Products</h1>

            <div>
                <button className='flex bg-white text-gray-800 p-2 rounded-lg cursor-pointer transition-all hover:scale-105 shadow-md mb-4' onClick={
                    () => {
                        handleClear();
                        handleOpenModal();
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2" strokeWidth="0.5" stroke="currentColor" /></svg>
                    Add Product
                </button>

                <div className="max-h-[85vh] overflow-y-auto">
                    <table className='w-full'>
                        <thead className='bg-gray-500 text-white'>
                            <tr>
                                <th className='product-th'>ISBN</th>
                                <th className='product-th'>ชื่อหนังสือ</th>
                                <th className='product-th'>ผู้แต่ง</th>
                                <th className='product-th'>ปีที่พิมพ์</th>
                                <th className='product-th'>รายละเอียด</th>
                                <th className='product-th'>หมวดหมู่</th>
                                <th className='product-th'>รูปภาพ</th>
                                <th className='product-th'>จํานวน</th>
                                <th className='product-th'>ราคาเต็ม</th>
                                <th className='product-th'>ราคาสุทธิ</th>
                                <th className='product-th'>สถานะ</th>
                                <th className='product-th w-[110px]'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book: any) => (
                                <tr className='product-tr' key={book.id}>
                                    <td className='product-td'>{book.isbn}</td>
                                    <td className='product-td'>{book.name}</td>
                                    <td className='product-td'>{book.author}</td>
                                    <td className='product-td'>{book.year}</td>
                                    <td className='product-td'>{book.description}</td>
                                    <td className='product-td'>{book.category}</td>
                                    <td className='product-td'>
                                        <Image
                                            src={book.imageUrl || '/assets/images/noimage.png'}
                                            width={100}
                                            height={100}
                                            alt={book.name}
                                        />
                                    </td>
                                    <td className='product-td'>{book.quantity}</td>
                                    <td className='product-td'>{book.fullPrice}</td>
                                    <td className='product-td'>{book.price}</td>
                                    <td className='product-td'>{book.status}</td>
                                    <td className='product-td'>
                                        <button className='edit-btn mr-1' onClick={() => handleEdit(book.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M19.09 14.441v4.44a2.37 2.37 0 0 1-2.369 2.369H5.12a2.37 2.37 0 0 1-2.369-2.383V7.279a2.356 2.356 0 0 1 2.37-2.37H9.56" /><path d="M6.835 15.803v-2.165c.002-.357.144-.7.395-.953l9.532-9.532a1.36 1.36 0 0 1 1.934 0l2.151 2.151a1.36 1.36 0 0 1 0 1.934l-9.532 9.532a1.36 1.36 0 0 1-.953.395H8.197a1.36 1.36 0 0 1-1.362-1.362M19.09 8.995l-4.085-4.086" /></g></svg>
                                        </button>
                                        <button className='delete-btn' onClick={() => handleDelete(book.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z" strokeWidth="0.5" stroke="currentColor" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            <Modal title="Add New Product" isOpen={isOpen} onClose={handleCloseModal}>
                <div>ISBN</div>
                <input className='input-field w-full' required type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />

                <div className='mt-2'>ชื่อหนังสือ</div>
                <input className='input-field w-full' type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <div className='mt-2'>ผู้แต่ง</div>
                <input className='input-field w-full' type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />

                <div className='mt-2'>ปีที่พิมพ์</div>
                <input className='input-field w-full' type="text" value={year} onChange={(e) => setYear(e.target.value)} />

                <div className='mt-2'>รายละเอียด</div>
                <textarea
                    className='input-field w-full h-28'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="กรอกรายละเอียดของหนังสือ..."
                />

                <div className='mt-2'>หมวดหมู่</div>
                <select className='mt-1 border border-gray-800 rounded-lg p-1' value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="History">History</option>
                    <option value="Social">Social</option>
                    <option value="Business">Business</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Art">Art</option>
                    <option value="Architecture">Architecture</option>
                    <option value="photograophy">Photography</option>
                    <option value="Textbook">Textbook</option>
                    <option value="Garden">Garden</option>
                    <option value="Food">Food</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Dictionary">Dictionary</option>
                </select>

                <div className='mt-2'>รูปภาพ</div>
                <Image
                    src={imageUrl || '/assets/images/noimage.png'}
                    width={200}
                    height={200}
                    alt={name}
                    className='my-2 rounded-lg border border-gray-200 object-cover'
                />
                <input className='file-input' type="file" onChange={handleFileUpload} />

                <div className='mt-2'>จํานวน</div>
                <input className='input-field w-full' type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />

                <div className='mt-2'>ราคาเต็ม</div>
                <input className='input-field w-full' type="number" value={fullPrice} onChange={(e) => setFullPrice(Number(e.target.value))} />

                <div className='mt-2'>ราคาสุทธิ</div>
                <input className='input-field w-full' type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />

                <div className='mt-2'>สถานะ</div>
                <select className='mt-1 border border-gray-800 rounded-lg p-1' value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Instock">Instock</option>
                    <option value="Outstock">Outstock</option>
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