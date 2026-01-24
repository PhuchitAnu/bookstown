'use client';

import ProductCard from "@/app/components/ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiConfig } from "@/app/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BOOKS_PER_PAGE_OPTIONS = [16, 24, 32];

export default function AllBooks() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [booksPerPage, setBooksPerPage] = useState(24);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiConfig.apiUrl}/book/listShow`);
                setBooks(response.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(books.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedBooks = books.slice(startIndex, endIndex);

    // Reset to page 1 when books per page changes
    const handleBooksPerPageChange = (value: number) => {
        setBooksPerPage(value);
        setCurrentPage(1);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="store-container px-4 py-10">
            <div className="flex items-center mb-8 gap-3">
                <Link href="/store" className="text-gray-600 hover:text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M10.843 13.069L6.232 8.384a.546.546 0 0 1 0-.768l4.61-4.685a.55.55 0 0 0 0-.771a.53.53 0 0 0-.759 0l-4.61 4.684a1.65 1.65 0 0 0 0 2.312l4.61 4.684a.53.53 0 0 0 .76 0a.55.55 0 0 0 0-.771" />
                    </svg>
                    <span className="ml-2 font-semibold">Back</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">All Books</h1>
            </div>

            {/* Controls: Books per page selector */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, books.length)} of {books.length} books
                </p>
                <div className="flex items-center gap-2">
                    <label htmlFor="booksPerPage" className="text-gray-700 font-medium">
                        Books per page:
                    </label>
                    <select
                        id="booksPerPage"
                        value={booksPerPage}
                        onChange={(e) => handleBooksPerPageChange(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        {BOOKS_PER_PAGE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-xl h-[380px]" />
                    ))}
                </div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center"
                    >
                        {paginatedBooks.map((book) => (
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            {/* Previous Button */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex gap-1">
                                {getPageNumbers().map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                        disabled={page === '...'}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all ${page === currentPage
                                                ? 'bg-blue-600 text-white'
                                                : page === '...'
                                                    ? 'cursor-default text-gray-500'
                                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
