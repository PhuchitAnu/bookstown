import Sidebar from "./sidebar";

export default function StoreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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