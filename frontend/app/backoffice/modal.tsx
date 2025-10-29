'use client';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className={`bg-white rounded-xl shadow-lg w-1/2`}>
                    <h2 className="text-xl font-bold bg-gray-800 text-white p-4 rounded-t-lg">
                        {title}
                        <button className="float-right text-gray-300 transition-all cursor-pointer hover:scale-110" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd" strokeWidth="0.5" stroke="currentColor"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06" /><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0" /></g></svg>
                        </button>
                    </h2>
                    <div className="text-black p-5 max-h-[90vh] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        )
    )
}