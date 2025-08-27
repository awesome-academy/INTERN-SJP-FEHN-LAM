export const ORDER_STATUS_CONFIG = {
    Processing: {
        label: "Đang xử lý",
        badgeVariant: "outline",
    },
    Shipped: {
        label: "Đang giao",
        badgeVariant: "secondary",
    },
    Completed: {
        label: "Hoàn thành",
        badgeVariant: "default",
    },
    Canceled: {
        label: "Đã hủy",
        badgeVariant: "destructive",
    },
} as const;
