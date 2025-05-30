# 🚀 Web CRUD Application - API Testing Project

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Một ứng dụng web CRUD (Create, Read, Update, Delete) hoàn chỉnh với giao diện hiện đại và API testing với Postman.

## 📋 Mục lục
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [API Documentation](#-api-documentation)
- [Deploy](#-deploy)
- [Vercel Deployment](#-vercel-deployment)
- [Testing với Postman](#-testing-với-postman)

## ✨ Tính năng

### Frontend
- ✅ Giao diện hiện đại, responsive
- ✅ CRUD operations với animation mượt mà
- ✅ Real-time search và filter
- ✅ Toast notifications
- ✅ Modal confirmations
- ✅ Loading states
- ✅ Error handling

### Backend
- ✅ RESTful API với Express.js
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling middleware
- ✅ Mock data storage

### Testing
- ✅ Postman collection với test scripts
- ✅ Automated API testing
- ✅ Response validation
- ✅ Performance testing

## 🛠 Công nghệ sử dụng

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter)

**Backend:**
- Node.js
- Express.js
- CORS middleware
- Body-parser

**Testing:**
- Postman
- Automated test scripts

## 📦 Cài đặt

### Prerequisites
- Node.js (version 14.0 trở lên)
- npm hoặc yarn
- Git
- Postman (cho API testing)

### Clone repository
```bash
git clone https://github.com/your-username/web-crud-app.git
cd web-crud-app
```

### Cài đặt dependencies

**Backend:**
```bash
cd backend
npm install
```

**Root project:**
```bash
npm install
```

## 🚀 Sử dụng

### Development Mode

**1. Khởi động Backend Server:**
```bash
cd backend
npm start
```
Server sẽ chạy tại: `http://localhost:5000`

**2. Mở Frontend:**
- Sử dụng Live Server trong VS Code
- Hoặc mở trực tiếp `frontend/index.html` trong browser

**3. Test API với Postman:**
```bash
# Import collection
postman/API-Tests.postman_collection.json
```

### Production Mode

**Build và deploy:**
```bash
npm run build
npm run start
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/data` | Lấy tất cả dữ liệu | - |
| POST | `/data` | Thêm dữ liệu mới | `{name, description}` |
| PUT | `/data/:id` | Cập nhật dữ liệu | `{name, description}` |
| DELETE | `/data/:id` | Xóa dữ liệu | - |

### Example Requests

**GET /api/data**
```javascript
fetch('http://localhost:5000/api/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

**POST /api/data**
```javascript
fetch('http://localhost:5000/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Sample Item",
    description: "This is a sample"
  })
});
```

## 🌐 Deploy

### Heroku Deployment

**1. Chuẩn bị:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login
```

**2. Tạo app:**
```bash
heroku create your-app-name
```

**3. Configure environment:**
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
```

**4. Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Vercel Deployment

### Cấu hình cho Vercel

Project này đã được cấu hình để triển khai trên Vercel với cả frontend và backend.

**Cấu hình `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### 🗄️ Database Configuration (MongoDB Atlas)

**Vấn đề Serverless Functions:**
- Vercel functions bị restart sau vài phút không hoạt động
- Data trong memory sẽ bị mất → Cần database persistent

**Setup MongoDB Atlas (FREE):**

1. **Tạo account tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**

2. **Tạo cluster mới:**
   - Chọn FREE tier (M0)
   - Chọn region gần nhất
   - Tạo database user & password

3. **Lấy Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/web-crud-app?retryWrites=true&w=majority
   ```

4. **Cấu hình Vercel Environment Variables:**
   ```bash
   # Trên Vercel dashboard
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/web-crud-app
   NODE_ENV=production
   ```

### Tự động phát hiện môi trường

API URLs được cấu hình động:
- **Local Development:** `http://localhost:5000/api`
- **Vercel Production:** `/api` (relative URL)

**Database Fallback:**
- **✅ Có MongoDB:** Sử dụng persistent storage
- **❌ Không có MongoDB:** Fallback to mock data (sẽ bị reset)

### Các bước deploy:

1. **Setup MongoDB Atlas & get connection string**

2. **Cài đặt Vercel CLI:**
```bash
npm i -g vercel
```

3. **Login vào Vercel:**
```bash
vercel login
```

4. **Set environment variables:**
```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string
```

5. **Deploy project:**
```bash
vercel --prod
```

### Live Demo
🌐 **URL:** [https://web-crud-app.vercel.app/](https://web-crud-app.vercel.app/)

### Lưu ý quan trọng:
- ✅ **Với MongoDB:** Data persistent, không bị mất khi restart
- ❌ **Không có MongoDB:** Sử dụng mock data, reset sau mỗi cold start
- CORS đã được cấu hình cho Vercel domain
- Frontend tự động detect environment và sử dụng URL phù hợp

## 🧪 Testing với Postman

### Import Collection & Environment

**1. Import Collection:**
```bash
postman/API-Tests.postman_collection.json
```

**2. Import Environments:**
- **Production:** `postman/Vercel-Production.postman_environment.json`
- **Local:** `postman/Local-Development.postman_environment.json`

### Test Coverage

**📋 CRUD Operations:**
- ✅ GET All Data - Lấy tất cả dữ liệu
- ✅ POST New Item - Thêm mục mới  
- ✅ PUT Update - Cập nhật dữ liệu
- ✅ GET Verify Update - Xác nhận cập nhật
- ✅ DELETE Item - Xóa dữ liệu

**❌ Error Handling:**
- ✅ 404 Errors - Item không tồn tại
- ✅ Validation Tests - Dữ liệu không hợp lệ
- ✅ Edge Cases - Các trường hợp đặc biệt

**⚡ Performance Tests:**
- ✅ Response Time - Thời gian phản hồi
- ✅ Cold Start Detection - Phát hiện cold start Vercel

### Chạy Tests

**Individual Tests:**
1. Chọn environment (Local hoặc Vercel Production)
2. Chọn request và click "Send"
3. Kiểm tra test results trong "Test Results" tab

**Collection Runner:**
1. Click vào collection name "Web CRUD App - Complete API Tests"
2. Click "Run collection"
3. Chọn environment phù hợp
4. Select các test cases muốn chạy
5. Click "Run [Collection Name]"

### Test Results Dashboard

Collection bao gồm comprehensive test scripts:

```javascript
// Example test output
✅ Mã trạng thái là 200
✅ Phản hồi là một mảng JSON  
⚡ Thời gian phản hồi < 3000ms
📋 Headers chứa Content-Type
📊 Số lượng dữ liệu ban đầu: 2
```

### Environment Switching

**Để test trên Vercel Production:**
```json
{
  "baseUrl": "https://web-crud-app.vercel.app"
}
```

**Để test trên Local Development:**
```json
{
  "baseUrl": "http://localhost:5000"
}
```

### Automated Testing Features

- 🔄 **Auto ID Management** - Tự động lưu và sử dụng test item IDs
- 🕐 **Dynamic Timestamps** - Sử dụng timestamp để tránh conflicts
- 📊 **Statistics Tracking** - Theo dõi số lượng dữ liệu
- 🚀 **Performance Monitoring** - Giám sát thời gian phản hồi
- 🧹 **Auto Cleanup** - Tự động dọn dẹp test data

## 📁 Cấu trúc Project

```
web-crud-app/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   └── api.js
│   └── assets/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
├── postman/
│   └── API-Tests.postman_collection.json
├── README.md
└── package.json
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@huynhkhuanit](https://github.com/huynhkhuanit)
- Email: huynhkhuanit@gmail.com

## 🙏 Acknowledgments

- Express.js team
- Font Awesome
- Google Fonts
- Postman team

---

⭐ Star this repo if you find it helpful!