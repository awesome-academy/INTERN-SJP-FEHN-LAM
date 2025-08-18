export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="container mx-auto p-4">{children}</main>
        </div>
    );
}
