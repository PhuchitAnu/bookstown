'use client';

import Image from 'next/image';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const router = useRouter();
    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        Swal.fire({ icon: 'success', title: 'ออกจากระบบสำเร็จ', timer: 1200, showConfirmButton: false });
        router.push('/signin');
    };

    return (
        <div className="w-72 bg-gray-800 h-screen text-white">
            <Image
                src="/assets/images/logobanner.png"
                alt="Bookstown Logo"
                width={200}
                height={10}
                className="object-contain mx-auto my-2 p-4 brightness-[0] contrast-[1] invert-[1]"
            />
            <div className="flex flex-col gap-4 p-4">
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold text-white transition">Logout</button>
            </div>
            <div className="bg-gray-700 h-full">
                <nav className="flex flex-col gap-4 p-4">
                    <a href="/backoffice/dashboard" className="hover:underline">Dashboard</a>
                    <a href="/backoffice/orders" className="hover:underline">Orders</a>
                    <a href="/backoffice/products" className="hover:underline">Products</a>
                </nav>
            </div>
        </div>
    );
}