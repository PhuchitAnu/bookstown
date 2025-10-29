'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Search from "../components/Search";

export default function Header() {
    const router = useRouter();

    return (
        <header className="bg-white w-full h-20 sm:h-24 shadow-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50">
            {/* 🔖 โลโก้ */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/store')}>
                <Image
                    src="/assets/images/logo.png"
                    alt="Bookstore Logo"
                    width={180}
                    height={180}
                    className="object-contain"
                />
            </div>

            {/* 🔍 Search bar */}
            <Search />

            {/* 🧭 ไอคอนเมนู */}
            <nav className="flex items-center gap-6 sm:gap-8">
                <Link href="/store/account" className="hover:text-indigo-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <circle cx="12" cy="6" r="4" />
                            <path d="M21 22a1 1 0 0 0-18 0Z" />
                        </g>
                    </svg>
                </Link>

                <Link href="/store/wishlist" className="hover:text-indigo-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
                        />
                    </svg>
                </Link>

                <Link href="/store/cart" className="hover:text-indigo-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M16 18a2 2 0 1 1 0 4a2 2 0 0 1 0-4m-9 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4a1 1 0 0 0-.8-1.6M6.87 13H6a1 1 0 0 0 0 2h11v1H7a2 2 0 0 1 0-4h-.13Z"
                        />
                    </svg>
                </Link>
            </nav>
        </header>
    );
}
