import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const generate_Access_And_RefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        console.log("ENV ACCESS:", process.env.ACCESS_TOKEN_SECRET);
        console.log("User found:", user?._id);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("TOKEN ERROR:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};



const registerUser = asynchandler(async (req, res) => {
    let { name, email, password, role } = req.body;

    // 🔹 sanitize input
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    console.log("Checking email:", email);

    const existedUser = await User.findOne({ email });

    console.log("Existing user:", existedUser);

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }


    const user = await User.create({
        name,
        email,
        password,
        role
    })


    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const { accessToken, refreshToken } = await generate_Access_And_RefreshToken(user._id)

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Not able to generate Acess token or refresh token")
    }

    const logInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const option = {
        httpOnly: true,
        secure: true
    }


    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: logInUser, accessToken, refreshToken
                },
                "User Registered Successfully"
            )
        )
})




//User logIn

const loginUser = asynchandler(async (req, res) => {


    const { email, password } = req.body

    if (!(password || email)) {
        throw new ApiError(400, "Password or email is required");
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid Password");
    }


    const { accessToken, refreshToken } = await generate_Access_And_RefreshToken(user._id);

    const logInUser = await User.findById(user._id).select(
        "-password"
    )

    const option = {
        httpOnly: true,
        secure: true
    }


    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: logInUser, accessToken, refreshToken
                },
                "User login Successfully"
            )
        )

})


//User logout

const logoutUser = asynchandler(async (req, res) => {

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(201, {}, "User logout sucessfully")
        )
})

const getCurrentUser = asynchandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw ApiError(400, "No user exist");
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User Fetched Suceesfully"
            )
        )
})


export { loginUser, logoutUser, registerUser, getCurrentUser };
