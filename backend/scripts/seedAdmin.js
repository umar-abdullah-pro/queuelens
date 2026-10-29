import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/database.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME?.trim() || !ADMIN_EMAIL?.trim() || !ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env",
      );
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error(
        "Use an initial admin password of at least 12 characters.",
      );
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();

    await connectDB();

    // Only allow this script to initialize the first admin.
    const adminExists = await User.exists({ role: "admin" });

    if (adminExists) {
      console.log("An admin already exists. No account was changed.");
      return;
    }

    // Never silently promote an existing patient or staff account.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already belongs to an account. No account was changed.",
      );
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await User.create({
      name: ADMIN_NAME.trim(),
      email,
      password: passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log("Initial admin created successfully.");
    console.log(`Admin email: ${admin.email}`);
    console.log(`Admin ID: ${admin._id}`);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

seedAdmin();
