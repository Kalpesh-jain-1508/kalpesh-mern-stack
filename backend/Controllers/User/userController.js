import { User } from "../../Models/User/userModel.js";
import ErrorHandler from "../../Utils/errorHandler.js";
import sendToken from "../../Utils/sendToken.js";
import catchAsyncError from "../../Middlewares/catchAsyncError.js";
import crypto from 'crypto';
import { sendEmail } from "../../Utils/sendEmail.js";

// Customer Registration
export const customerRegister = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const existingUser = await User.findOne({ email, isDeleted: false });

  if (existingUser)
    return next(new ErrorHandler("Email already exists", 400));

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: "user",
    verificationToken
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
  const message = `Welcome ${firstName},\n\nPlease verify your email by clicking the following link:\n${verificationUrl}\n\n`;

  await sendEmail({
    email: user.email,
    subject: "Email Verification",
    message,
  });
  
  res.status(201).json({
    success: true,
    message: `Verification email sent to ${user.email}. Please verify your email to complete the registration.`,
  });

//   sendToken(res, user, "Customer registered successfully", 201);
});

// Admin Registration
export const adminRegister = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const existingUser = await User.findOne({ email, isDeleted: false });

  if (existingUser)
    return next(new ErrorHandler("Email already exists", 400));

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: "admin",
    verificationToken
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
  const message = `Welcome ${firstName},\n\nPlease verify your email by clicking the following link:\n${verificationUrl}\n\nIf you did not register, please ignore this email.`;

  await sendEmail({
    email: user.email,
    subject: "Email Verification",
    message,
  });

  res.status(201).json({
    success: true,
    message: `Verification email sent to ${user.email}. Please verify your email to complete the registration.`,
  });

//   sendToken(res, user, "Admin registered successfully", 201);
});

// Email Verification
export const verifyEmail = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
  
    const user = await User.findOne({ verificationToken: token });
  
    if (!user)
      return next(new ErrorHandler("Invalid or expired token", 400));
  
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  });
  

// Admin Login
export const adminLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Email and Password are required", 400));

  const user = await User.findOne({ email }).select("+password");

  if(!user)
    return next(new ErrorHandler("Invalid Email", 403));

  if (user.role !== "admin")
    return next(new ErrorHandler("You are not allowed to login from here", 403));

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid Email or Password", 401));

  sendToken(res, user, "Admin logged in successfully", 200);
});

// User Login
export const userLogin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password)
        return next(new ErrorHandler('All Field is Required', 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.role !== "user")
        return next(new ErrorHandler("You are not allowed to login from here", 403));

    const isMatchPassword = await user.comparePassword(password);

    if (!isMatchPassword)
        return next(new ErrorHandler('Invalid Email or Password', 500));

    user.password = undefined;

    sendToken(res, user, "User logged in successfully", 200);
});

// Logout user or admin
export const userLogout = catchAsyncError(async (req, res, next) => {
    res
    .status(200)
    .cookie("usersCookie", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: 'Logout Successfully'
    });
});

// get login user details
export const myProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user?.id);
    res.status(200).json({
      success: true,
      user,
    });
  });