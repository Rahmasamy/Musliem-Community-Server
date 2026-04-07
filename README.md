# 🌙 Muslim Community Server

> A comprehensive backend solution for building connected Muslim communities with real-time messaging, event management, and service sharing.

[![Node.js](https://img.shields.io/badge/Node.js-v22-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-blue?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.18-green?logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Real-time Features](#real-time-features)
- [Database Models](#database-models)
- [Contributing](#contributing)
- [Support](#support)

---

## ✨ Features

### Core Features
- **👤 User Authentication** - Secure JWT-based authentication with refresh tokens
- **💬 Real-time Messaging** - Group chats and private messaging with Socket.io
- **📅 Event Management** - Create, manage, and join community events
- **👥 Group Management** - Build and manage community groups
- **🛍️ Marketplace** - Share products and services within the community
- **💳 Payment Integration** - PayPal integration for transactions
- **📊 Dashboard Analytics** - Community insights and statistics
- **📸 Media Management** - Cloudinary integration for image/video storage
- **📧 Email Services** - Automated email notifications and communications
- **🔐 Security** - Password reset, email verification, role-based access control

### Advanced Features
- **🔄 Automatic Cleanup** - Cron jobs for ad removal and data maintenance
- **📱 RESTful API** - Fully documented REST endpoints
- **👤 Profile Management** - User profiles with skills and business information
- **🔍 Search Functionality** - Search across products, services, and users
- **⭐ Contact System** - User contact and inquiry management

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js 5.1
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io 4.8
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Payment**: PayPal SDK

### Utilities & Middleware
- **Validation**: Express Validator
- **File Upload**: Multer + Multer Storage Cloudinary
- **Task Scheduling**: Node-cron
- **Email**: Nodemailer & Resend
- **Encryption**: Bcryptjs, Crypto
- **API Documentation**: RESTful endpoints
- **Development**: Nodemon

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Cloudinary** account (for media uploads)
- **PayPal Developer** account (for payments)
- **Gmail Account** (for email service)

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Rahmasamy/Musliem-Community-Server.git
cd Musliem-Community-Server
```

### Step 2: Install Dependencies

```bash
npm install
```

---

## 🔧 Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=1h

# Client URLs
CLIENT_URL=http://localhost:5173
CLIENT_URL_PROD=https://yourdomain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_PORT_PROD=465

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# PayPal Configuration (Optional)
# PAYMENT_BASE_URL=https://api-m.sandbox.paypal.com
```

### Important Notes:
- ⚠️ **Never commit `.env` file** to version control
- For Gmail: Use [App Passwords](https://myaccount.google.com/apppasswords) instead of your regular password
- Ensure your MongoDB Atlas **IP Whitelist** includes your current IP address or use `0.0.0.0/0` for development

---

## 🚀 Getting Started

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode

```bash
npm start
```

---

## 📚 API Documentation

### Authentication Routes
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/verify-reset-code - Verify reset code
POST   /api/auth/reset-password    - Reset password
```

### Service Routes
```
GET    /api/services               - Get all services
POST   /api/services               - Create service
GET    /api/services/:id           - Get service details
PUT    /api/services/:id           - Update service
DELETE /api/services/:id           - Delete service
```

### Event Routes
```
GET    /api/events                 - Get all events
POST   /api/events                 - Create event
GET    /api/events/:id             - Get event details
PUT    /api/events/:id             - Update event
DELETE /api/events/:id             - Delete event
POST   /api/events/:id/join        - Join event
```

### Group Routes
```
GET    /api/groups                 - Get all groups
POST   /api/groups                 - Create group
GET    /api/groups/:id             - Get group details
PUT    /api/groups/:id             - Update group
DELETE /api/groups/:id             - Delete group
POST   /api/groups/:id/join        - Join group
```

### Messaging Routes
```
GET    /api/messages               - Get messages
POST   /api/messages               - Send message
DELETE /api/messages/:id           - Delete message
```

### Product Routes
```
GET    /api/products               - Get all products
POST   /api/products               - Create product
GET    /api/products/:id           - Get product details
PUT    /api/products/:id           - Update product
DELETE /api/products/:id           - Delete product
```

### Payment Routes
```
POST   /api/payments/create        - Create payment
GET    /api/payments/:id           - Get payment details
```

### Search Routes
```
GET    /api/search?q=query         - Search products/services/users
```

### Dashboard Routes
```
GET    /api/dashboard/stats        - Get dashboard statistics
GET    /api/dashboard/analytics    - Get analytics data
```

---

## 📁 Project Structure

```
src/
├── config/                    # Configuration files
│   ├── db.js                 # MongoDB connection
│   ├── basicSetupCloudinary.js
│   ├── eventCloudinary.js
│   └── ...
│
├── controllers/              # Business logic
│   ├── authController/
│   ├── serviceController/
│   ├── eventController/
│   ├── groupController/
│   ├── messageController/
│   ├── privateChatController/
│   ├── productController/
│   └── ...
│
├── models/                   # Database schemas
│   ├── User/
│   ├── Service/
│   ├── Event/
│   ├── Group/
│   ├── Product/
│   ├── Message/
│   └── ...
│
├── routes/                   # API endpoints
│   ├── authRoutes/
│   ├── serviceRoutes/
│   ├── eventRoutes/
│   ├── groupRoutes/
│   └── ...
│
├── middlewares/              # Custom middlewares
│   ├── auth/
│   ├── errorHandleMiddleware/
│   └── upload/
│
├── services/                 # Utility services
│   ├── Email/
│   ├── payment/
│   ├── cron-job/
│   └── dashboard-anayltics/
│
├── utils/                    # Helper utilities
│   └── asyncHandler.js
│
└── index.js                  # Application entry point
```

---

## 🔄 Real-time Features

The application uses **Socket.io** for real-time communication:

### Events Handled
- **User Connection** - `connection`, `disconnect`
- **Messaging** - `sendMessage`, `receiveMessage`, `messageDelete`
- **Notifications** - Real-time updates for events, groups, and messages
- **Status Updates** - User online/offline status

### Usage Example
```javascript
// Client-side (Frontend)
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.emit('sendMessage', { message: 'Hello!' });

socket.on('receiveMessage', (data) => {
  console.log('New message:', data);
});
```

---

## 🗄️ Database Models

### Main Collections
- **Users** - User profiles, authentication data, business info
- **Services** - Community services listing
- **Events** - Community events and activities
- **Groups** - Community groups and forums
- **Products** - Product listings
- **Messages** - Group messages
- **PrivateMessages** - Direct messages between users
- **PrivateChats** - Chat sessions
- **Payments** - Payment transactions
- **ContactUs** - Contact inquiries

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Refresh token rotation
- ✅ Password reset with temporary tokens
- ✅ Role-based access control (RBAC)
- ✅ Email verification
- ✅ CORS protection
- ✅ Input validation with Express Validator

---

## 📧 Email Service Configuration

### Gmail Setup
1. Enable 2-factor authentication on Gmail
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the App Password in `EMAIL_PASS` environment variable

### Alternative: Resend Service
Configure `RESEND_API_KEY` for alternative email delivery

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 💬 Support

For support, email: rahmasamy949@gmail.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- MongoDB for database hosting
- Cloudinary for media management
- Socket.io for real-time features
- PayPal for payment processing
- All contributors and the community

---

**Made with ❤️ for the Muslim Community**