'use client';

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import ScrollToTop from "../components/ScrollToTop";
import SidebarCategory from "./sidebar";

export default function StoreLayout({
    children,
    showSidebar = true
}: Readonly<{
    children: React.ReactNode,
    showSidebar?: boolean
}>) {
    const pathname = usePathname();
    const hideSidebarRoutes = ['/store/account', '/store/cart', '/store/checkout'];

    const shouldShowSidebar = showSidebar && !hideSidebarRoutes.includes(pathname);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <Header />

            {/* Main Section */}
            <main className="flex-1 w-full px-10 py-6 mt-5 flex flex-col md:flex-row gap-8">
                {/* Sidebar (left) */}
                {shouldShowSidebar && (
                    <aside className="w-full md:w-64 shrink-0">
                        <SidebarCategory />
                    </aside>
                )}

                {/* Page Content */}
                <div className="flex-1">
                    <ScrollToTop />
                    {children}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
