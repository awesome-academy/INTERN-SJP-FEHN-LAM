
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
            <div className="w-full  bg-white p-8 rounded-xl shadow-lg">
                {children}
            </div>
        </div>
    );
}
