

import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from '../utils';


describe('cn function', () => {
    it('should combine basic class names', () => {
        expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle conditional classes correctly', () => {
        const isActive = true;
        const hasError = false;
        expect(cn('base-class', { 'font-bold': isActive, 'text-red-500': hasError })).toBe('base-class font-bold');
    });

    it('should merge conflicting tailwind classes correctly', () => {
        expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });
});


describe('formatCurrency function', () => {
    it('should format a number into Vietnamese currency', () => {
        const result = formatCurrency(123456);
        expect(result.replace(/\s/g, ' ')).toBe('123.456 ₫');
    });

    it('should format a string number into Vietnamese currency', () => {
        const result = formatCurrency('78900.5');
        expect(result.replace(/\s/g, ' ')).toBe('78.901 ₫');
    });

    it('should return "N/A" for invalid input', () => {
        expect(formatCurrency('not a number')).toBe('N/A');
    });

    it('should handle zero correctly', () => {
        const result = formatCurrency(0);
        expect(result.replace(/\s/g, ' ')).toBe('0 ₫');
    });
});
describe('formatDate function', () => {
    it('should format an ISO date string to dd/mm/yyyy format', () => {

        const isoDate = '2025-12-25T10:30:00Z';
        expect(formatDate(isoDate)).toBe('25/12/2025');
    });

    it('should return an empty string if the input is empty', () => {
        expect(formatDate('')).toBe('');
    });

    it('should handle different date formats that JS Date object can parse', () => {
        const anotherDate = 'September 11, 2025';
        expect(formatDate(anotherDate)).toBe('11/09/2025');
    });
});
