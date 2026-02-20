# 🚀 MacroPlace – Mini Marketplace Backend

MacroPlace is a RESTful backend API for a mini marketplace application.  
It supports user authentication, role-based access control, product management, search & pagination, and favorites functionality.

> ⚠️ Frontend and mobile clients are under development.  
> ✅ Backend is fully functional and testable via Postman.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- cookie-parser
- dotenv

---

## 📦 Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Role-based authorization (Admin/User)

### 📦 Products
- Create product (Admin only)
- Update product (Admin only)
- Delete product (Admin only)
- Get all products
- Search products
- Pagination support
- Get single product

### ❤️ Favorites
- Add to favorites
- Remove from favorites
- Get user favorites

### 🌱 Seed Data
- 1 Admin user
- 1 Normal user
- 10 sample products

---

## ⚙️ Project Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd backend
