const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const path = require('path');
const PORT = 3002;
const sortObject = require('sort-object-keys');
const querystring = require('qs');
const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';
const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MAILTRAP_PORT = parseInt(process.env.MAILTRAP_PORT) || 2525;
const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASS = process.env.MAILTRAP_PASS;
const dateFormat = require("dateformat").default || require("dateformat");
const { activateEmailTemplate } = require('./emailTemplates.js');
const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASS
    }
});
server.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

server.use(jsonServer.bodyParser);
server.post('/register', async (req, res) => {
    const { email, password, name, phone, address } = req.body;
    const db = router.db;

    const existingUser = db.get('users').find({ email }).value();
    if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const activateToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    const activateUrl = `${process.env.FRONTEND_URL}/activate?token=${activateToken}`;

    const users = db.get('users').value();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
    const newUser = {
        id: newId,
        email,
        password,
        name,
        phone,
        address,
        role: 'CUSTOMER',
        isActivate: false,
        activateToken,
        createdAt: new Date().toISOString()
    };

    try {

        const emailHtml = activateEmailTemplate(name, activateUrl);
        await transporter.sendMail({
            from: `"My App" <no-reply@myapp.com>`,
            to: email,
            subject: 'Kích hoạt tài khoản của bạn',
            html: emailHtml
        });

        db.get('users').push(newUser).write();
        res.status(200).json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản." });

    } catch (error) {
        console.error("Lỗi gửi email:", error);
        res.status(500).json({ message: "Không thể gửi email kích hoạt", error: error.message });
    }
});
server.get('/activate', (req, res) => {
    const { token } = req.query;
    const db = router.db;

    if (!token) {
        return res.status(400).json({ message: "Token không hợp lệ" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { email } = decoded;

        const user = db.get('users').find({ email }).value();
        if (!user) {
            return res.status(400).json({ message: "User không tồn tại" });
        }

        if (user.isActivate) {
            return res.status(200).json({ message: "Tài khoản đã được kích hoạt " });
        }

        db.get('users').find({ email }).assign({ isActivate: true }).write();

        res.status(200).json({ message: "Kích hoạt tài khoản thành công! Bạn có thể đăng nhập." });

    } catch (error) {
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
});

server.post('/login', (req, res) => {
    const { email, password } = req.body;
    const db = router.db;

    const user = db.get('users').find({ email }).value();
    if (!user) {
        return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (!user.isActivate) {
        return res.status(400).json({ message: 'Vui lòng kích hoạt tài khoản qua email' });
    }

    if (password !== user.password) {
        return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const accessToken = jwt.sign(
        { email: user.email, id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    const { password: _, ...userToReturn } = user;

    res.status(200).json({
        accessToken,
        user: userToReturn
    });
});
server.post('/create-payment-url', (req, res) => {
    try {
        const { amount, orderItems } = req.body;
        const date = new Date();
        const createDate = dateFormat(date, "yyyymmddHHMMss");
        const orderId = createDate;

        const db = router.db;
        const orderData = {
            id: orderId,
            items: orderItems || [],
            total: amount,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            paymentMethod: 'VNPay'
        }
        db.get('orders').push(orderData).write();

        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
        if (ipAddr.includes('::1')) {
            ipAddr = '118.69.24.180';
        }

        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: process.env.VNP_TMNCODE,
            vnp_Amount: amount * 100,
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: ipAddr,
            vnp_Locale: 'vn',
            vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: process.env.VNP_RETURN_URL,
            vnp_TxnRef: orderId
        };

        vnp_Params.vnp_OrderInfo = vnp_Params.vnp_OrderInfo
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/\s+/g, '-');

        const sortedParams = sortObject(vnp_Params);
        const signData = Object.entries(sortedParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET.trim());
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex').toUpperCase();

        vnp_Params['vnp_SecureHash'] = signed;

        const paymentUrl = process.env.VNP_URL + '?' + querystring.stringify(vnp_Params, { encode: true });

        res.status(200).json({ paymentUrl, orderId });

    } catch (error) {
        console.error("Payment URL creation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
server.get('/vnpay-return', (req, res) => {
    try {
        let vnp_Params = req.query;

        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = sortObject(vnp_Params);


        const secretKey = process.env.VNP_HASHSECRET;
        const signData = Object.keys(vnp_Params)
            .map(key => `${key}=${vnp_Params[key]}`)
            .join('&');


        const hmac = crypto.createHmac("sha512", secretKey.trim());
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash.toLowerCase() === signed.toLowerCase()) {
            const responseCode = vnp_Params['vnp_ResponseCode'];
            const orderId = vnp_Params['vnp_TxnRef'];
            const amount = parseInt(vnp_Params['vnp_Amount']) / 100;

            const db = router.db;
            const order = db.get('orders')
                .find({ id: orderId })
                .value();

            if (order) {
                if (responseCode === '00') {
                    db.get('orders')
                        .find({ id: orderId })
                        .assign({
                            status: 'Completed',
                            transactionNo: vnp_Params['vnp_TransactionNo'],
                            updatedAt: new Date().toISOString()
                        })
                        .write();

                    return res.status(200).json({
                        code: '00',
                        message: 'Giao dịch thành công',
                        data: {
                            orderId,
                            amount,
                            transactionNo: vnp_Params['vnp_TransactionNo']
                        }
                    });
                } else {
                    db.get('orders')
                        .find({ id: orderId })
                        .assign({
                            status: 'Failed',
                            updatedAt: new Date().toISOString()
                        })
                        .write();

                    return res.status(200).json({
                        code: responseCode,
                        message: 'Giao dịch không thành công',
                        data: { orderId, amount }
                    });
                }
            } else {
                return res.status(404).json({
                    code: '01',
                    message: 'Không tìm thấy đơn hàng',
                    data: { orderId }
                });
            }
        } else {
            return res.status(200).json({
                code: '97',
                message: 'Chữ ký không hợp lệ'
            });
        }
    } catch (error) {
        console.error("VNPay return error:", error);
        return res.status(200).json({
            code: '99',
            message: 'Lỗi xử lý thanh toán',
            error: error.message
        });
    }
});
server.use(router);
server.listen(PORT, () => {
});
