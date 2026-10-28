
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "BOOKED",
        "CHECKED_IN",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      default: "BOOKED",
    },

    checkedInAt: {
      type: Date,
      default: null,
    },

    serviceStartedAt: {
      type: Date,
      default: null,
    },

    serviceCompletedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Useful for retrieving a patient's appointment history
appointmentSchema.index({ patientId: 1, createdAt: -1 });

// Useful for retrieving appointments by service and status
appointmentSchema.index({ serviceId: 1, status: 1, checkedInAt: 1 });

// Useful for retrieving appointments assigned to staff
appointmentSchema.index({ assignedStaffId: 1, status: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
