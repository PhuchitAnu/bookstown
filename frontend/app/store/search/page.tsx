'use client';

import ProductCard from "@/app/components/ProductCard";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { apiConfig } from "@/app/config";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function SearchPage() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res;

                if (searchQuery) {
                    // ✅ ถ้ามี query -> เรียก API search
                    res = await axios.get(`${apiConfig.apiUrl}/book/search`, {
                        params: { q: searchQuery },
                    });
                } else {
                    // ✅ ถ้าไม่มี -> แสดงทั้งหมดตามเดิม
                    res = await axios.get(`${apiConfig.apiUrl}/book/listShow`);
                }

                setBooks(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    return (
        <Suspense>
            <div className="store-container px-4 py-10">
                <div className="flex items-center mb-8 gap-3">
                    <Link href="/store/allbooks" className="text-gray-600 hover:text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M10.843 13.069L6.232 8.384a.546.546 0 0 1 0-.768l4.61-4.685a.55.55 0 0 0 0-.771a.53.53 0 0 0-.759 0l-4.61 4.684a1.65 1.65 0 0 0 0 2.312l4.61 4.684a.53.53 0 0 0 .76 0a.55.55 0 0 0 0-.771" />
                        </svg>
                        <span className="ml-2 font-semibold">Back</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{searchQuery ? `Search Result for "${searchQuery}"` : 'All Books'}</h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded-xl h-[380px]" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center"
                    >
                        {books.map((book) => (
                            <ProductCard
                                key={book.id}
                                image={book.imageUrl || '/assets/images/noimage.png'}
                                title={book.name}
                                author={book.author}
                                price={book.price}
                                onClick={() => router.push(`/store/${book.id}`)}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </Suspense>
    );
}
