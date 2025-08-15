export enum OrderStatus {
    Processing = "Processing",
    Shipped = "Shipped",
    Completed = "Completed",
    Cancelled = "Cancelled",
}
export enum ProductTab {
    ALL = 'Tất cả',
    NEW = 'Mới nhất',
    POPULAR = 'Nổi bật',
}
export const DEVICE_TABS = [
    'Tất cả',
    'Máy khoan',
    'Máy hàn',
    'Máy in',
    'Máy quét',
] as const;

export type DeviceTab = typeof DEVICE_TABS[number]; 
