"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";

export default function StoreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role"); // ดึง role จาก localStorage ด้วย

        // ถ้าไม่มี token หรือไม่ใช่ admin → กลับหน้า signin
        if (!token || role !== "admin") {
            router.push("/signin");
        }
    }, [router]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10 h-screen">
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-white shadow-gray-500">
                    {children}
                </div>
            </div>
        </div>
    );
} 