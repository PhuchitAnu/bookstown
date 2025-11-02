'use client';

import Image from "next/image";

interface ProductCardProps {
    image: string;
    title: string;
    author: string;
    price: number;
    fullPrice: number;
    onClick?: () => void;
}

export default function ProductCard({ image, title, author, price, fullPrice, onClick }: ProductCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-64 cursor-pointer overflow-hidden"
        >
            <div className="relative w-full h-80">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 flex flex-col justify-between h-40">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{author}</p>
                </div>
                <span className="text-indigo-600 font-extrabold text-xl mt-4">
                    <span className="text-gray-400/50 font-semibold text-base line-through mr-2">{fullPrice.toLocaleString()}฿</span>
                    {price.toLocaleString()}฿
                </span>
            </div>
        </div>
    );
}

