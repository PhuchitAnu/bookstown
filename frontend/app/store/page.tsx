'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiConfig } from "@/app/config";
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import { DotButton, useDotButton } from '../components/EmblaCarouselDotButton';
import { motion } from "framer-motion";

export default function StorePage() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [emblaRef, emblaApi] = useEmblaCarousel({}, [Fade()]);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const images = [
        "/assets/images/Banner.png",
        "/assets/images/Banner2.jpg",
        "/assets/images/Banner3.jpg",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiConfig.apiUrl}/book/listShow`);
                setBooks(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="store-container px-8 sm:px-16 py-10 flex flex-col gap-12">

                {/* 🎞️ Banner Section */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="embla"
                >
                    <div className="embla__viewport rounded-xl overflow-hidden" ref={emblaRef}>
                        <div className="embla__container">
                            {images.map((src, index) => (
                                <div className="embla__slide" key={index}>
                                    <Image
                                        src={src}
                                        alt="Banner"
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="embla__slide__img object-cover w-full h-[400px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 gap-2">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                onClick={() => onDotButtonClick(index)}
                                className={'embla__dot'.concat(
                                    index === selectedIndex ? ' embla__dot--selected' : ''
                                )}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* 📚 All Books Section */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-900">All Books</h2>
                    <button
                        className="cursor-pointer text-gray-700 font-semibold transition-all hover:text-gray-800 hover:scale-105"
                        onClick={() => router.push('/store/allbooks')}
                    >
                        View All →
                    </button>
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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 place-items-center gap-8"
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
        </div>
    );
}
