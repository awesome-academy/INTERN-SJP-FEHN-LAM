"use client";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink
} from "@/components/ui/pagination";
import { use } from "react";

interface PaginationProps {
    total: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const CustomPagination = ({ total, currentPage, onPageChange }: PaginationProps) => {
    const pageNumbers = [];

    if (total <= 5) {
        for (let i = 1; i <= total; i++) {
            pageNumbers.push(i);
        }
    } else {
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(total, currentPage + 2);

        if (start > 2) {
            pageNumbers.push(1);
            pageNumbers.push("...");
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (end < total - 1) {
            pageNumbers.push("...");
            pageNumbers.push(total);
        }
    }

    return (
        <div className="mt-6">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => {
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {pageNumbers.map((page, index) => (
                        <PaginationItem key={`${page}-${index}`}>
                            {page === '...' ? (
                                <span className="px-4 py-2">...</span>
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page as number)}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => {
                                if (currentPage < total) onPageChange(currentPage + 1);
                            }}
                            className={currentPage >= total ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
