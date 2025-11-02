'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiConfig } from '@/app/config';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import { motion } from 'framer-motion';

interface Book {
    id: number;
    name: string;
    author: string;
    price: number;
    fullPrice: number;
    imageUrl: string;
}

export default function CategoryPage() {
    const { slug } = useParams();
    const router = useRouter();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiConfig.apiUrl}/book/listByCategory/${slug}`);
                setBooks(res.data || []);
            } catch (error) {
                console.error('Error fetching category books:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [slug]);

    const categoryName = slug
        ? slug.toString().replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Category';

    if (loading) {
        return (
            <div className="px-8 md:px-40 py-20">
                <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 h-80 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="store-container px-4 h-full py-10">
            {/* 🧭 Breadcrumb / Back button */}
            <div className="flex items-center mb-10">
                <Link
                    href="/store"
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
                <h1 className="text-2xl font-bold ml-4">{categoryName}</h1>
            </div>

            {/* 🎞️ Category Books */}
            {books.length === 0 ? (
                <p className="text-gray-500 text-center py-20">
                    No books available in this category.
                </p>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center"
                >
                    {books.map((book) => (
                        <ProductCard
                            key={book.id}
                            image={book.imageUrl || '/assets/images/noimage.png'}
                            title={book.name}
                            author={book.author}
                            price={book.price}
                            fullPrice={book.fullPrice}
                            onClick={() => router.push(`/store/${book.id}`)}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
