import { Product } from "@/types";
import ProductListItem from "../product/ProductListItem";

interface SearchResultsProps {
    products: Product[];
    visible: boolean;
    onClose: () => void;
}

const SearchResults = ({ products, visible, onClose }: SearchResultsProps) => {
    if (!visible) return null;

    return (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg max-h-96 overflow-y-auto z-50">
            {products.length > 0 ? (
                <div className="p-4">
                    {products.map(product => (
                        <div key={product.id} onClick={onClose}>
                            <ProductListItem
                                product={product}
                                size="very_small"
                                showRating={false}
                                showDescription={false}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500">
                    Không tìm thấy sản phẩm
                </div>
            )}
        </div>
    );
};

export default SearchResults;
