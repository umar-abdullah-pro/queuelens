import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Register a new patient
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: phone?.trim() }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or username is already registered.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || undefined,
      password: passwordHash,
      role: "patient",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please log in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    // Handles duplicate-key errors, including concurrent registrations.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email, username, or phone is already registered.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during registration.",
    });
  }
};

// Log in an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    // Use the same message for unknown emails and incorrect passwords.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account is inactive.",
      });
    }

    // Regenerate the session ID to prevent session fixation.
    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration error:", error);

        return res.status(500).json({
          success: false,
          message: "Unable to create a session.",
        });
      }

      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save error:", saveError);

          return res.status(500).json({
            success: false,
            message: "Unable to save your session.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Login successful.",
          user: req.session.user,
        });
      });
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login.",
    });
  }
};

// Log out the current user
export const logout = (req, res) => {
  if (!req.session) {
    res.clearCookie("queuelens.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }

  req.session.destroy((error) => {
    if (error) {
      console.error("Session destruction error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to log out.",
      });
    }

    res.clearCookie("queuelens.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  });
};

// Get the currently logged-in user
export const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
