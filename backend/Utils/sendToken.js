const sendToken = (res, user, message, statusCode = 200) =>{
    const token = user.getJWTToken();
    
    const options = {
        expires: new Date(Date.now()+process.env.COOKIE_EXPIRES*60*60*1000),
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    }
    
    res.status(statusCode).cookie("usersCookie", token, options).json({
        success:true,
        message,
        user
    });
}

export default sendToken