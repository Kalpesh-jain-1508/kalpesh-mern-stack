import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter First Name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please Enter Last Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Email"],
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
      maxlenght: [100, "Password not be more than 100 characters"],
    },
    role: {
      type: String,
      required: [true, "Please Enter Role"],
      enum: ["admin", "user"]
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Make Email First Letter Small
userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
