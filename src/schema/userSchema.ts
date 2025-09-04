import * as z from 'zod';
import { Role } from '@/types/role';
import { Status } from '@/types/status';

export const userSchema = z.object({
    username: z.string().min(2, "Họ và tên phải ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().refine(
        (phone) => {
            const vietnamPhoneRegex = /^(0[1-9]|84[1-9])[0-9]{8}$/;
            return vietnamPhoneRegex.test(phone.replace(/\s/g, ''));
        }, {
        message: "Số điện thoại không hợp lệ. Ví dụ: 0901234567 hoặc 84901234567"
    }
    ).min(10, "Số điện thoại phải ít nhất 10 ký tự"),
    address: z.string().min(5, "Địa chỉ phải ít nhất 5 ký tự"),
    role: z.enum([Role.ADMIN, Role.CUSTOMER], "Vui lòng chọn vai trò"),
    status: z.enum([Status.ACTIVE, Status.INACTIVCE], "Vui lòng chọn trạng thái"),
});

export const userCreateSchema = userSchema.extend({
});


export const userUpdateSchema = userSchema.extend({

});
export const registerSchema = userSchema.extend({
    password: z.string().refine(
        (password) => {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const isValidLength = password.length >= 8;

            return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isValidLength;
        },
        {
            message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt và tối thiểu 8 ký tự"
        }
    ),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải ít nhất 6 ký tự"),
    newsletter: z.boolean().refine(value => value === true, "Bạn cần đồng ý nhận tin tức")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"]
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
