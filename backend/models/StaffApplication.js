import mongoose from "mongoose";

const staffApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    organization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate applications using the same email.
staffApplicationSchema.index({ email: 1 }, { unique: true });

// Prevent duplicate employee IDs within the application system.
staffApplicationSchema.index({ employeeId: 1 }, { unique: true });

// Useful for admin application review.
staffApplicationSchema.index({ status: 1, createdAt: 1 });

const StaffApplication = mongoose.model(
  "StaffApplication",
  staffApplicationSchema,
);

export default StaffApplication;
