
export function activateEmailTemplate(username, activateUrl) {
    return `
    <!DOCTYPE html>
    <html lang="vi">
  
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kích hoạt tài khoản</title>
    </head>
  
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
            style="border-collapse: collapse; margin-top: 20px; border: 1px solid #cccccc;">
            <tr>
                <td align="center" bgcolor="#007bff"
                    style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    Chào mừng bạn đến với Thanh Cong
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #333333; font-size: 20px; font-weight: bold;">
                                Xin chào ${username},
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 30px 0; color: #555555; font-size: 16px; line-height: 24px;">
                                Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào nút bên dưới để hoàn tất việc kích hoạt
                                tài khoản của bạn. Link này sẽ hết hạn sau 1 giờ.
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <a href="${activateUrl}"
                                    style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                                    Kích hoạt tài khoản
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#dddddd" style="padding: 20px 30px 20px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #777777; font-size: 12px;" align="center">
                                Đây là email tự động, vui lòng không trả lời.
                                <br>
                                &copy; 2025 My App. All rights reserved.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
  
    </html>
    `;
}
