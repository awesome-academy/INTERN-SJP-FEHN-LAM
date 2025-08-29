import Image from 'next/image';
import { FaTruck, FaUndo, FaGift, FaThumbsUp } from 'react-icons/fa';

export default function BannerDesktopSplitWithImages() {
    return (
        <div className="hidden md:block w-full max-w-7xl mx-auto px-8 py-12">
            {/* Container chia 2 cột */}
            <div className="flex flex-col md:flex-row gap-12">

                {/* Cột trái: Banner sản phẩm */}
                <div className="md:w-2/3"> {/* Tăng chiều rộng cột trái */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">MÁY KHOAN ĐA NĂNG</h2>
                                <h1 className="text-4xl font-extrabold text-yellow-600 mb-3">DEWALT</h1>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Thiết kế nhỏ gọn, phù hợp, đa mục đích
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Mạnh mẽ, bền bỉ và hiệu suất lớn hơn
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Khoan cắt với độ chính xác tuyệt đối
                                    </li>
                                </ul>
                                <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded text-sm font-medium transition">
                                    ĐẶT HÀNG
                                </button>
                            </div>
                            <div className="w-32 h-32 relative ml-6">
                                <Image
                                    src="/images/dewalt-drill.png"
                                    alt="Máy khoan Dewalt"
                                    fill
                                    sizes="100%"
                                    className="object-contain rounded-lg shadow-sm"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Chính sách */}
                <div className="md:w-1/3 space-y-8"> {/* Giảm chiều rộng cột phải */}
                    {/* Miễn phí vận chuyển */}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaTruck className="text-yellow-500 mt-1" size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">MIỄN PHÍ VẬN CHUYỂN</h3>
                            <p className="text-gray-700">Chúng tôi vận chuyển miễn phí với các đơn hàng trị giá trên 1.000.000 Đ.</p>
                        </div>
                    </div>

                    {/* Chính sách đổi trả */}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaUndo className="text-yellow-500 mt-1" size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">CHÍNH SÁCH ĐỔI TRẢ</h3>
                            <p className="text-gray-700">Nếu phát hiện lỗi của nhà sản xuất, chúng tôi sẽ đổi mới sản phẩm trong 7 ngày đầu tiên.</p>
                        </div>
                    </div>

                    {/* Khuyến mãi hàng tuần */}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaGift className="text-yellow-500 mt-1" size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">KHUYẾN MẠI HÀNG TUẦN</h3>
                            <p className="text-gray-700">Mỗi thứ 7 hàng tuần đều có chương trình giảm giá và khuyến mại lớn.</p>
                        </div>
                    </div>

                    {/* Cam kết hàng chính hãng */}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <FaThumbsUp className="text-yellow-500 mt-1" size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">CAM KẾT HÀNG CHÍNH HÃNG</h3>
                            <p className="text-gray-700">Chúng tôi cam kết bán hàng chính hãng 100% với tất cả các loại sản phẩm.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
