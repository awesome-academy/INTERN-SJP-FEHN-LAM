"use client";

import React from 'react';
import { Category } from '@/types/category';
import { Bars3Icon, CurrencyDollarIcon, PencilIcon } from '@heroicons/react/24/outline';
import PromotionalProducts from './PromotionalProducts';
interface FilterOption {
    label: string;
    value: string;
    count: number;
}

interface SidebarProps {
    categories: Category[];
    priceRanges: FilterOption[]
    onCategorySelect: (id: number | null) => void;
    onPriceSelect: (range: string | null) => void;
    selectedCategoryId: number | null;
}

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-600 uppercase mb-4">
        {icon}
        {title}
    </h3>
);

const Sidebar: React.FC<SidebarProps> = ({ categories, priceRanges, onCategorySelect, onPriceSelect, selectedCategoryId }) => {
    return (
        <aside className="w-full md:w-1/4 lg:w-1/5 space-y-8">
            <section>
                <SectionTitle icon={<Bars3Icon className="h-5 w-5" />} title="Danh mục sản phẩm" />
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li key={category.id}>
                            <button
                                onClick={() => onCategorySelect(category.id)}
                                className={`w-full text-left text-gray-700 hover:text-amber-700 cursor-pointer  text-sm transition-colors ${selectedCategoryId === category.id ? 'text-amber-700 font-bold' : ''}`}
                            >
                                {category.category_name}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <SectionTitle icon={<CurrencyDollarIcon className="h-5 w-5" />} title="Tìm theo mức giá" />
                <ul className="space-y-2">
                    {priceRanges.map((price) => (
                        <li key={price.value}>
                            <button
                                onClick={() => onPriceSelect(price.value)}
                                className="w-full flex justify-between text-gray-700 hover:text-amber-700 text-sm transition-colors cursor-pointer"
                            >
                                <span>{price.label}</span>
                                <span className="text-gray-500">({price.count})</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <PromotionalProducts />
            </section>
        </aside>
    );
};

export default Sidebar;
