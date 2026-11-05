import mongoose from "mongoose";
import StaffApplication from "../models/StaffApplication.js";
import User from "../models/User.js";

// 1. Submit staff application
export const createStaffApplication = async (req, res) => {
  try {
    const { name, email, phone, employeeId, organization } = req.body;

    // Validate required fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !employeeId?.trim() ||
      !organization?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All application fields are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmployeeId = employeeId.trim().toUpperCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Check whether an account already uses this email
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Check whether an application already exists
    const existingApplication = await StaffApplication.findOne({
      $or: [{ email: normalizedEmail }, { employeeId: normalizedEmployeeId }],
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "An application with this email or employee ID already exists.",
      });
    }

    const application = await StaffApplication.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      employeeId: normalizedEmployeeId,
      organization: organization.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Staff application submitted successfully.",
      application: {
        id: application._id,
        name: application.name,
        email: application.email,
        organization: application.organization,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Staff application error:", error);

    // Handle duplicate-key errors from unique indexes.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An application with these details already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit staff application.",
    });
  }
};

// 2. Check application status using email
export const getMyApplicationStatus = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const application = await StaffApplication.findOne({
      email: email.trim().toLowerCase(),
    }).select(
      "name email organization status rejectionReason createdAt reviewedAt",
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No staff application found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve application status.",
    });
  }
};

//3. Get all staff applications (for admin review)
export const getPendingStaffApplications = async (req, res) => {
  try {
    const applications = await StaffApplication.find({
      status: "PENDING",
    })
      .select("-__v")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get pending staff applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff applications",
    });
  }
};

//4. admin approval of staff applications
export const approveStaffApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate application ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // 2. Find pending application
    const application = await StaffApplication.findOne({
      _id: id,
      status: "PENDING",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Pending staff application not found",
      });
    }

    // 3. Check whether email already belongs to a user
    const existingUser = await User.findOne({
      email: application.email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // 4. Approve application
    application.status = "APPROVED";
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Staff application approved successfully",
      application,
    });
  } catch (error) {
    console.error("Approve staff application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve staff application",
    });
  }
};

//5. Reject staff application
export const rejectStaffApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    // 1. Validate application ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // 2. Validate rejection reason
    if (
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    // 3. Find pending application
    const application = await StaffApplication.findOne({
      _id: id,
      status: "PENDING",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Pending staff application not found",
      });
    }

    // 4. Update application
    application.status = "REJECTED";
    application.rejectionReason = rejectionReason.trim();
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Staff application rejected successfully",
      application,
    });
  } catch (error) {
    console.error("Reject staff application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject staff application",
    });
  }
};
