import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCurrency(amount: number | string): string {
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numberAmount)) {
    return "N/A";
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numberAmount);
}
