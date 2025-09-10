import Image from 'next/image';
import { FaTruck, FaUndo, FaGift, FaThumbsUp } from 'react-icons/fa';

export default function BannerDesktopSplitWithImages() {
    return (
        <div className="hidden md:block w-full max-w-7xl mx-auto px-8 py-12">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-2/3">
                    <div className="bg-secondary rounded-lg shadow-sm p-8 h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 mt-[50px]">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">MÁY KHOAN ĐA NĂNG</h2>
                                <h1 className="text-5xl font-extrabold text-yellow-600 mb-4">DEWALT</h1>
                                <ul className="space-y-3 text-base text-gray-700">
                                    <li className="flex items-center">
                                        <span className="text-yellow-500 mr-3">✓</span>
                                        Thiết kế nhỏ gọn, phù hợp, đa mục đích
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-yellow-500 mr-3">✓</span>
                                        Mạnh mẽ, bền bỉ và hiệu suất lớn hơn
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-yellow-500 mr-3">✓</span>
                                        Khoan cắt với độ chính xác tuyệt đối
                                    </li>
                                </ul>
                                <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105">
                                    ĐẶT HÀNG
                                </button>
                            </div>
                            <div className="w-64 h-64 relative ml-8">
                                <Image
                                    src="/images/dewalt-drill.png"
                                    alt="Máy khoan Dewalt"
                                    fill
                                    sizes="100%"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="md:w-1/3 space-y-8">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaTruck className="text-yellow-500 mt-1" size={40} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">MIỄN PHÍ VẬN CHUYỂN</h3>
                            <p className="text-gray-700">Chúng tôi vận chuyển miễn phí với các đơn hàng trị giá trên 1.000.000 Đ.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaUndo className="text-yellow-500 mt-1" size={40} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">CHÍNH SÁCH ĐỔI TRẢ</h3>
                            <p className="text-gray-700">Nếu phát hiện lỗi của nhà sản xuất, chúng tôi sẽ đổi mới sản phẩm trong 7 ngày đầu tiên.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaGift className="text-yellow-500 mt-1" size={40} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">KHUYẾN MẠI HÀNG TUẦN</h3>
                            <p className="text-gray-700">Mỗi thứ 7 hàng tuần đều có chương trình giảm giá và khuyến mại lớn.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaThumbsUp className="text-yellow-500 mt-1" size={40} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">CAM KẾT HÀNG CHÍNH HÃNG</h3>
                            <p className="text-gray-700">Chúng tôi cam kết bán hàng chính hãng 100% với tất cả các loại sản phẩm.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
