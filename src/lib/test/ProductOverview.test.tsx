import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductOverview from '../../components/product/ProductOverview';
import { useSession } from 'next-auth/react';


import { useCartStore } from '@/stores/useCartStore';

vi.mock('next-auth/react');
vi.mock('@/stores/useCartStore');
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

const mockProduct = {
    id: "1",
    product_name: 'Giày Sneaker ABC',
    price: 1500000,
    description: 'Mô tả sản phẩm.',
    image_url: '/test-image.jpg',
    size: ['40', '41'],
    color: ['Trắng', 'Đen'],
    stock_quantity: 2,
    categoryId: 2,
    inStock: true,
    brand: 'CoolBrand',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe('ProductOverview Component', () => {
    const mockAddProductToCart = vi.fn();
    const mockUseSession = vi.mocked(useSession);
    const mockUseCartStore = vi.mocked(useCartStore);

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseCartStore.mockReturnValue({
            addProductToCart: mockAddProductToCart,
        });
    });

    it('should call addProductToCart when user is logged in', async () => {
        const user = userEvent.setup();
        mockUseSession.mockReturnValue({
            data: {
                user: {
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                    role: 'CUSTOMER',
                },
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            },
            status: 'authenticated',
            update: vi.fn(),
        });
        render(<ProductOverview product={mockProduct} />);
        const addToCartButton = screen.getByRole('button', { name: /thêm vào giỏ hàng/i });
        await user.click(addToCartButton);

        expect(mockAddProductToCart).toHaveBeenCalledOnce();
        expect(mockAddProductToCart).toHaveBeenCalledWith(mockProduct, 1, 1);
    });

    it('should show an error toast when user is not logged in', async () => {
        const user = userEvent.setup();
        const { toast } = await import('react-toastify');

        mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn(), });

        render(<ProductOverview product={mockProduct} />);
        const addToCartButton = screen.getByRole('button', { name: /thêm vào giỏ hàng/i });
        await user.click(addToCartButton);

        expect(mockAddProductToCart).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Bạn cần đăng nhập để thêm vào giỏ hàng!');
    });
});
