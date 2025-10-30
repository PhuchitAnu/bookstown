'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiConfig } from '@/app/config';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import Swal from 'sweetalert2';
import { addToCart } from '@/app/utils/addToCart';
import { motion } from 'framer-motion';

interface Book {
    id: number;
    name: string;
    author: string;
    category: string;
    price: number;
    imageUrl: string;
    description: string;
}

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                // 1️⃣ ดึงข้อมูลหนังสือหลัก
                const bookRes = await axios.get(`${apiConfig.apiUrl}/book/listId/${id}`);
                const bookData = bookRes.data;
                setBook(bookData);

                // 2️⃣ ดึงหนังสืออื่นใน category เดียวกัน
                if (bookData?.category) {
                    const listRes = await axios.get(
                        `${apiConfig.apiUrl}/book/listByCategory/${bookData.category}`
                    );
                    setBooks(listRes.data.filter((b: Book) => b.id !== bookData.id)); // ไม่เอาเล่มเดียวกันซ้ำ
                }
            } catch (error) {
                console.error('Error fetching book details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }

    const handleAddToCart = () => {
        if (!book) return;

        const token = getCookie("token");
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า',
                confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
            }).then(() => router.push('/signin'));
            return;
        }

        addToCart(book);
        Swal.fire({
            icon: 'success',
            title: 'เพิ่มหนังสือลงตะกร้าเรียบร้อยแล้ว',
            timer: 1500,
            showConfirmButton: false,
        });
    };

    // 🦴 Skeleton Loading
    const Skeleton = () => (
        <div className="animate-pulse flex flex-col md:flex-row gap-10 p-4 pb-10 border-b border-gray-800/20">
            <div className="bg-gray-300 rounded-lg w-64 h-96" />
            <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-2/3" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-4/5" />
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-10 bg-gray-300 rounded w-1/2 mt-10" />
            </div>
        </div>
    );

    if (loading || !book) {
        return (
            <div className="px-8 md:px-40 py-20">
                <Skeleton />
            </div>
        );
    }

    return (
        <div className="store-container px-4 h-full py-10">
            {/* 🧭 Breadcrumb / Back button */}
            <div className="flex items-center mb-10">
                <Link
                    href={`/store/category/${book.category}`}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill="currentColor"
                            d="M10.843 13.069L6.232 8.384a.546.546 0 0 1 0-.768l4.61-4.685a.55.55 0 0 0 0-.771a.53.53 0 0 0-.759 0l-4.61 4.684a1.65 1.65 0 0 0 0 2.312l4.61 4.684a.53.53 0 0 0 .76 0a.55.55 0 0 0 0-.771"
                        />
                    </svg>
                    <span className="ml-2 font-medium">Back</span>
                </Link>
                <h1 className="text-2xl font-bold ml-4">{book.category}</h1>
            </div>

            {/* 🎞️ Book Details */}
            <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row gap-10 p-6 pb-10 border-b border-gray-200 bg-white/70 rounded-2xl shadow-sm"
            >
                {/* Book Image */}
                <div className="bg-gray-100 rounded-xl p-6 shadow-inner flex justify-center items-center w-full md:w-auto">
                    <Image
                        src={book.imageUrl || '/assets/images/noimage.png'}
                        alt={book.name}
                        width={400}
                        height={600}
                        className="w-64 h-96 object-cover rounded-lg shadow-md"
                    />
                </div>

                {/* Book Info */}
                <div className="flex flex-col flex-1 justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{book.name}</h1>
                        <p className="text-gray-600 text-xl mt-1">{book.author}</p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">
                            Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {book.description}
                        </p>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-md transition-all"
                        >
                            <span className="text-lg">{book.price}฿</span>
                            <span>Add to Cart</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* 🧭 Best Seller Section */}
            <div className="mt-14">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{book.category}</h1>
                    <button
                        className="text-gray-600 hover:text-gray-800 font-semibold transition"
                        onClick={() => router.push(`/store/category/${book.category}`)}
                    >
                        View All
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center"
                >

                    {books.slice(0, 4).map((book) => (
                        <ProductCard
                            key={book.id}
                            image={book.imageUrl || '/assets/images/noimage.png'}
                            title={book.name}
                            author={book.author}
                            price={book.price.toString()}
                            onClick={() => router.push(`/store/${book.id}`)}
                        />
                    ))}

                </motion.div>
            </div>
        </div>
    );
}
