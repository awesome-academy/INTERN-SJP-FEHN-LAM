const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const fs = require('fs');
const path = require('path');
const PORT = 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';
const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MAILTRAP_PORT = parseInt(process.env.MAILTRAP_PORT) || 2525;
const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASS = process.env.MAILTRAP_PASS;
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
    const newUser = {
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

server.use(router);
server.listen(PORT, () => {
});
