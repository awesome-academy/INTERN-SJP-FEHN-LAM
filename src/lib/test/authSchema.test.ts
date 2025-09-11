import { describe, it, expect } from 'vitest';
import { registrationSchema } from '@/schema/authSchema';

const validData = {
    username: 'John Doe',
    email: 'john.doe@example.com',
    phone: '0987654321',
    address: '123 Main St, Hanoi',
    password: 'Password123!',
    confirmPassword: 'Password123!',
};

describe('registrationSchema', () => {

    it('should validate correct data successfully', () => {
        const result = registrationSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should fail if password does not meet complexity requirements', () => {
        const invalidData = { ...validData, password: 'password123' };

        const result = registrationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);

        if (!result.success) {
            const passwordErrors = result.error.flatten().fieldErrors.password;
            expect(passwordErrors?.[0]).toContain('Mật khẩu phải chứa ít nhất 1 chữ hoa');
        }
    });

    it('should fail if passwords do not match', () => {
        const invalidData = { ...validData, confirmPassword: 'Password321!' };

        const result = registrationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);

        if (!result.success) {
            const confirmPasswordErrors = result.error.flatten().fieldErrors.confirmPassword;
            expect(confirmPasswordErrors?.[0]).toBe('Mật khẩu và xác nhận mật khẩu không khớp');
        }
    });

    it('should fail for an invalid Vietnamese phone number', () => {
        const invalidData = { ...validData, phone: '123456789' };

        const result = registrationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);

        if (!result.success) {
            const phoneErrors = result.error.flatten().fieldErrors.phone;
            expect(phoneErrors?.[0]).toContain('Số điện thoại không hợp lệ');
        }
    });
});
