'use client';

import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { SlSocialGoogle } from 'react-icons/sl';
import { FaSkype } from 'react-icons/fa';
import { BsTelephoneFill, BsChatDots } from 'react-icons/bs';
import techcombankLogo from "@/assets/images/bank-techtcombank.png";
import vietinbankLogo from "@/assets/images/bank-vietinbank.png";
import vpbankLogo from "@/assets/images/bank-vpbank.png";
import tienphongbankLogo from "@/assets/images/bank-tienphongbank.png";
import maritimebankLogo from "@/assets/images/bank-maritimebank.png";
import dongabankLogo from "@/assets/images/bank-dongabank.png";
import asbankLogo from "@/assets/images/bank-asbank.png";
import vietcapitalbankLogo from "@/assets/images/bank-vietcapitalbank.png";
import Image from 'next/image';
const Footer = () => {
    const policies = ["Chính sách giao hàng", "Chính sách đổi sản phẩm", "Chính sách bảo hành", "Chính sách trả góp", "Giới thiệu hàng đổi trả", "Vận chuyển miễn phí"];
    const services = ["Hệ thống cửa hàng", "Hướng dẫn mua hàng", "Hướng dẫn thanh toán", "Tích điểm đổi thưởng", "Dịch vụ đổi trả hàng", "Câu hỏi thường gặp"];
    const news = ["Tin tức mới nhất", "Tin tức khuyến mãi", "Tuyển dụng, đào tạo", "Download tài liệu", "Chương trình đối tác", "Nhà phát triển ứng dụng"];
    const footerSections = [
        {
            title: "CHÍNH SÁCH",
            items: policies
        },
        {
            title: "DỊCH VỤ & HỖ TRỢ",
            items: services
        },
        {
            title: "TIN TỨC - SỰ KIỆN",
            items: news
        }
    ];
    const socialMedia = [
        { icon: FiFacebook, name: "Facebook" },
        { icon: FiTwitter, name: "Twitter" },
        { icon: SlSocialGoogle, name: "G+ Google" },
        { icon: FaSkype, name: "Skype" },
        { icon: FiInstagram, name: "Instagram" },
    ];
    const paymentBanks = [
        techcombankLogo,
        vietinbankLogo,
        vpbankLogo,
        tienphongbankLogo,
        maritimebankLogo,
        dongabankLogo,
        asbankLogo,
        vietcapitalbankLogo
    ];
    const footerLinks = ["Trang chủ", "Giới thiệu", "Sản phẩm", "Tin khuyến mại", "Dịch vụ", "Liên hệ"];

    return (
        <footer className="w-full bg-secondary text-secondary-foreground text-sm">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1.25fr_1.25fr_1.25fr_1.25fr] gap-8">
                    <div>
                        <h3 className="text-base font-semibold text-black mb-4 uppercase">VỀ CHÚNG TÔI</h3>
                        <p className="leading-relaxed">Công ty Cổ phần Công nghệ DKT đã và đang khẳng định được vị trí hàng đầu trong lĩnh vực Thương mại điện tử.</p>
                        <div className="mt-4 flex flex-col gap-2">
                            <p className="flex items-start"><span className="mr-2 mt-1">📍</span> Tầng 4 - Tòa nhà Hanoi Group 442 Đội Cấn Ba Đình - Hà Nội</p>
                            <p className="flex items-center"><span className="mr-2">✉️</span> support@dkt.com.vn</p>
                            <p className="flex items-center"><span className="mr-2">📞</span> (84-4) 66558868 - (84-4) 37868904</p>
                        </div>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-base font-semibold text-black mb-4 uppercase">{section.title}</h3>
                            <ul className="flex flex-col gap-2">
                                {section.items.map((item, index) => (
                                    <li key={index}>
                                        <a href="#" className="hover:text-blue-500">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h3 className="text-base font-semibold text-black mb-4 uppercase">KẾT NỐI</h3>
                        <ul className="flex flex-col gap-2">
                            {socialMedia.map((social) => (
                                <li key={social.name} className="flex items-center gap-2">
                                    <social.icon /><a href="#" className="hover:text-blue-500">{social.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row md:justify-between gap-8">
                    <div className="md:basis-[55%]">
                        <p className="font-semibold mb-2">Thanh toán:</p>
                        <div className="grid grid-cols-4 gap-4 items-center">
                            {paymentBanks.map((src, index) =>
                                <Image
                                    key={index}
                                    src={src}
                                    alt={`Payment Bank ${index + 1}`}
                                    className="w-full h-auto object-contain" />
                            )}
                        </div>
                    </div>
                    <div className="md:basis-[45%] ml-[100px]">
                        <p className="font-semibold mb-2 ml-[30px]">Giải đáp nhanh:</p>
                        <div className="flex flex-row items-center justify-around h-full">
                            <div className="flex items-center gap-3">
                                <BsTelephoneFill className="text-3xl text-[#f39c12]" />
                                <div>
                                    <p>Tư vấn miễn phí (24/7)</p>
                                    <p className="text-2xl font-bold text-[#e74c3c]">1900 650 650</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BsChatDots className="text-3xl text-[#f39c12]" />
                                <div>
                                    <p>Góp ý - phản hồi - thắc mắc</p>
                                    <p className="text-2xl font-bold text-[#e74c3c]">1900 650 650</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-300">
                <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center text-xs text-[#999]">
                    <div className="flex flex-col gap-1">
                        <span>Bản quyền thuộc về .</span>
                        <span>Phát triển bởi .</span>
                    </div>
                    <div className="flex gap-2">
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4a4a4a] text-white hover:bg-gray-600"><FiFacebook size={16} /></a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4a4a4a] text-white hover:bg-gray-600"><FiTwitter size={16} /></a>
                    </div>
                    <nav>
                        <ul className="flex items-center divide-x divide-gray-300">
                            {footerLinks.map((link) => (
                                <li key={link} className="px-2 first:pl-0 last:pr-0">
                                    <a href="#" className="hover:text-blue-500">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
