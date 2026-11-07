import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";

// 1. Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { serviceId, scheduledAt, notes } = req.body;

    if (!serviceId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Service ID and scheduled time are required.",
      });
    }

    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const appointmentDate = new Date(scheduledAt);

    if (
      Number.isNaN(appointmentDate.getTime()) ||
      appointmentDate <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid future appointment date.",
      });
    }

    if (notes && (typeof notes !== "string" || notes.length > 500)) {
      return res.status(400).json({
        success: false,
        message: "Notes must be a string of at most 500 characters.",
      });
    }

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive.",
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      serviceId,
      scheduledAt: appointmentDate,
      notes: notes?.trim() || undefined,
    });

    await appointment.populate(
      "serviceId",
      "name category baseDurationMinutes",
    );

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment.",
    });
  }
};

// 2. Get logged-in patient's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
    })
      .populate("serviceId", "name category baseDurationMinutes")
      .populate("assignedStaffId", "name")
      .sort({ scheduledAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve appointments.",
    });
  }
};

// 3. Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patientId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "BOOKED") {
      return res.status(400).json({
        success: false,
        message: "Only booked appointments can be cancelled.",
      });
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment.",
    });
  }
};

// 4. Patient check-in
export const checkInAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patientId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "BOOKED") {
      return res.status(400).json({
        success: false,
        message: "Only booked appointments can be checked in.",
      });
    }

    if (new Date() < appointment.scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "You cannot check in before your scheduled time.",
      });
    }

    // 5. Check 15-minute grace period
    const checkInDeadline = new Date(
      appointment.scheduledAt.getTime() + 15 * 60 * 1000
    );

    const now = new Date();

    if (now > checkInDeadline) {
      appointment.status = "NO_SHOW";
      await appointment.save();

      return res.status(400).json({
        success: false,
        message: "Check-in time has expired. Appointment marked as NO_SHOW.",
      });
    }
    //6. Fcheck-in patient
    appointment.status = "CHECKED_IN";
    appointment.checkedInAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment checked in successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check in.",
    });
  }
};

// 5. Get patient's queue status
export const getQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patientId: req.user.id,
    }).populate("serviceId", "name baseDurationMinutes");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "CHECKED_IN") {
      return res.status(400).json({
        success: false,
        message: "Queue status is available only after check-in.",
        status: appointment.status,
      });
    }

    const patientsAhead = await Appointment.countDocuments({
      serviceId: appointment.serviceId._id,
      status: "CHECKED_IN",
      checkedInAt: { $lt: appointment.checkedInAt },
    });

    const duration = appointment.serviceId.baseDurationMinutes;

    return res.status(200).json({
      success: true,
      queue: {
        appointmentId: appointment._id,
        serviceName: appointment.serviceId.name,
        status: appointment.status,
        queuePosition: patientsAhead + 1,
        patientsAhead,
        estimatedWaitMinutes: patientsAhead * duration,
        averageServiceDurationMinutes: duration,
      },
    });
  } catch (error) {
    console.error("Queue status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve queue status.",
    });
  }
};

// 6. Get staff queue
export const getStaffQueue = async (req, res) => {
  try {
    const assignedServices = await Service.find({
      staffIds: req.user.id,
      isActive: true,
    }).select("_id name baseDurationMinutes");

    if (assignedServices.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        queue: [],
      });
    }

    const serviceIds = assignedServices.map((service) => service._id);

    const appointments = await Appointment.find({
      serviceId: { $in: serviceIds },
      status: "CHECKED_IN",
      checkedInAt: { $ne: null },
    })
      .populate("patientId", "name email phone")
      .populate("serviceId", "name category baseDurationMinutes")
      .sort({ checkedInAt: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      queue: appointments.map((appointment, index) => ({
        queuePosition: index + 1,
        appointmentId: appointment._id,
        patient: appointment.patientId,
        service: appointment.serviceId,
        checkedInAt: appointment.checkedInAt,
        scheduledAt: appointment.scheduledAt,
        status: appointment.status,
      })),
    });
  } catch (error) {
    console.error("Staff queue error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve staff queue.",
    });
  }
};

// 7. Staff starts an appointment
export const startAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "CHECKED_IN") {
      return res.status(400).json({
        success: false,
        message: "Only checked-in appointments can be started.",
      });
    }

    const service = await Service.findOne({
      _id: appointment.serviceId,
      staffIds: req.user.id,
      isActive: true,
    });

    if (!service) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this service.",
      });
    }

    appointment.status = "IN_PROGRESS";
    appointment.assignedStaffId = req.user.id;
    appointment.serviceStartedAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment started successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Start appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start appointment.",
    });
  }
};

// 8. Staff completes an appointment
export const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: "Only in-progress appointments can be completed.",
      });
    }

    // Verify that this staff member started the appointment
    if (appointment.assignedStaffId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this appointment.",
      });
    }

    const completedAt = new Date();

    const durationMs =
      completedAt.getTime() - appointment.serviceStartedAt.getTime();

    const actualDurationMinutes = Math.ceil(durationMs / 60000);

    appointment.status = "COMPLETED";
    appointment.serviceCompletedAt = completedAt;
    appointment.actualDurationMinutes = actualDurationMinutes;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Complete appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete appointment.",
    });
  }
};