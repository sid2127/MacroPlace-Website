import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // 🧹 Clear old data
    await User.deleteMany();
    await Product.deleteMany();

    console.log("Old data deleted");

    // 👤 Create Users
    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@test.com",
        password: "123456",
        role: "admin",
      },
      {
        name: "Normal User",
        email: "user@test.com",
        password: "123456",
        role: "user",
      },
    ]);

    console.log("Users created");

    // 📦 Create Products
    const products = [
      {
        title: "iPhone 15 Pro",
        description: "Latest Apple smartphone with A17 chip",
        price: 135000,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Nike Air Max",
        description: "Comfortable and stylish running shoes",
        price: 7500,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Dell XPS 13",
        description: "Powerful laptop for developers",
        price: 120000,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Sony WH-1000XM5",
        description: "Noise cancelling headphones",
        price: 30000,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Apple Watch Series 9",
        description: "Smartwatch with health tracking",
        price: 45000,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Gaming Mouse",
        description: "RGB high precision gaming mouse",
        price: 2500,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Bluetooth Speaker",
        description: "Portable speaker with deep bass",
        price: 4000,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Backpack",
        description: "Waterproof travel backpack",
        price: 1800,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Coffee Maker",
        description: "Automatic drip coffee machine",
        price: 6000,
        image: "https://via.placeholder.com/300",
      },
      {
        title: "Wireless Keyboard",
        description: "Slim and ergonomic keyboard",
        price: 3200,
        image: "https://via.placeholder.com/300",
      },
    ];

    await Product.insertMany(products);

    console.log("Products created");
    console.log("Seeding completed successfully ✅");

    process.exit();
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
};

seedData();
