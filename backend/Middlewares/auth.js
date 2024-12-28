import { User } from "../Models/User/userModel.js";
import ErrorHandler from "../Utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { usersCookie } = req.cookies;
    if (!usersCookie)
      return next(new ErrorHandler("Please Login to Access this Resource", 401));
  
    const decodedData = jwt.verify(usersCookie, process.env.JWT_SECRET);
  
    const user = await User.findById(decodedData._id);

    if (!user.verified)
      return next(new ErrorHandler("Please verify your email to access this resource", 403));
    
    req.user = user;
  
    next();
});