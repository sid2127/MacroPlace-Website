import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";

//Create Product

const createProduct = asynchandler(async (req, res) => {
    const { title, description, price } = req.body;

    if (!(title && description && price)) {
        throw new ApiError(400, "All fields are required");
    }

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Product image is required");
    }

    const imageUpload = await UploadOnCloudinary(imageLocalPath);

    if (!imageUpload) {
        throw new ApiError(500, "Failed to upload image on Cloudinary");
    }

    const product = await Product.create({
        title,
        description,
        price,
        image: imageUpload.secure_url,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    );
});

//Get Single Product

const getSingleProduct = asynchandler(async (req, res) => {

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});


//Update Product 

const updateProduct = asynchandler(async (req, res) => {

    const { productId } = req.params;
    const { title, description, price } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this product");
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;

    if (req.file) {
        const imageUpload = await UploadOnCloudinary(req.file.path);

        if (!imageUpload) {
            throw new ApiError(500, "Failed to upload new image");
        }

        product.image = imageUpload.secure_url;
    }

    await product.save();

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
    );
});

//Delete Product 

const deleteProduct = asynchandler(async (req, res) => {

    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this product");
    }

    await product.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});


//Search Products

const searchProducts = asynchandler(async (req, res) => {

    const { query } = req.query;

    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    const products = await Product.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    })
        .populate("owner", "username fullname avatar")
        .sort({ createdAt: -1 });

    if (!products.length) {
        throw new ApiError(404, "No matching products found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            products,
            "Search results fetched successfully"
        )
    );
});


//Get All Products

const getAllProducts = asynchandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = 10;   // fixed 10 products per page

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
        .populate("owner", "username fullname avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                products
            },
            "Products fetched successfully"
        )
    );
});

//Add To favourite/Unfavourite

const toggleFavourite = asynchandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(400, "Product not found");
    }

    const user = await User.findById(req.user._id);

    const isAlreadyFavourite = user.favorites.includes(productId);

    if (isAlreadyFavourite) {
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favorites: productId } }
        );

        return res.status(200).json(
            new ApiResponse(200, { isFavourite: false }, "Product removed from favourites")
        );
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { favorites: productId } }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "Product added to favourites")
    )

})

//Get Favourite Products 

const getFavouriteProducts = asynchandler(async (req, res) => {

    const user = await User.findById(req.user._id).populate({
        path: "favorites",
        select: "title description price image",
        options: { sort: { createdAt: -1 } }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Favourite products fetched successfully")
    );
});

export { createProduct, getSingleProduct, updateProduct, deleteProduct, searchProducts, getAllProducts, toggleFavourite, getFavouriteProducts }