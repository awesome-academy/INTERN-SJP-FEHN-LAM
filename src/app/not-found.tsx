import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                    <div className="text-center md:text-left">
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            BEST SOLUTION FOR YOU
                        </p>
                        <h1 className="mt-4 text-6xl font-bold tracking-tight text-yellow-400 sm:text-8xl">
                            404 ERROR
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            Chúng tôi không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/"
                                className="inline-block rounded-md bg-yellow-400 px-6 py-3 text-base font-semibold text-black shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                            >
                                Trở về trang chủ
                            </Link>
                        </div>
                    </div>


                    <div className="flex items-center justify-center">
                        <Image
                            src="/images/dewalt-drill.png"
                            alt="404 Not Found"
                            width={500}
                            height={500}
                            className="h-auto w-full max-w-sm"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
