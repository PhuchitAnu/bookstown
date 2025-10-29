'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const categories = [
    "History",
    "Social",
    "Business",
    "Fiction",
    "Non-Fiction",
    "Art",
    "Architecture",
    "Photography",
    "Textbook",
    "Garden",
    "Food",
    "Fashion",
    "Dictionary",
];

export default function SidebarCategory() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Categories</h2>

            <nav className="flex flex-col gap-2">
                {categories.map((cat) => {
                    const slug = cat.toLowerCase().replace(/\s+/g, "-");
                    const isActive = pathname.includes(`/store/category/${slug}`);

                    return (
                        <motion.div
                            key={cat}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Link
                                href={`/store/category/${slug}`}
                                className={`block px-4 py-2 rounded-lg font-medium transition-all ${isActive
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {cat}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>
        </aside>
    );
}
