import mongoose from "mongoose";
import Service from "../models/Service.js";

// GET /api/services
// List active services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .select("-__v")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve services.",
    });
  }
};

// GET /api/services/:id
// Get one active service
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const service = await Service.findOne({
      _id: id,
      isActive: true,
    }).select("-__v");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve service.",
    });
  }
};

// POST /api/services
// Admin only
export const createService = async (req, res) => {
  try {
    const { name, description, category, baseDurationMinutes, staffIds } =
      req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !["consultation", "follow_up", "diagnostic", "other"].includes(
        category,
      ) ||
      !Number.isInteger(baseDurationMinutes) ||
      baseDurationMinutes < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid name, category, and positive integer duration are required.",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.length > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string of at most 1000 characters.",
      });
    }

    if (staffIds !== undefined) {
      if (
        !Array.isArray(staffIds) ||
        staffIds.some((id) => !mongoose.isValidObjectId(id))
      ) {
        return res.status(400).json({
          success: false,
          message: "staffIds must be an array of valid user IDs.",
        });
      }

      const uniqueStaffIds = [...new Set(staffIds.map(String))];

      const staffCount = await mongoose.model("User").countDocuments({
        _id: { $in: uniqueStaffIds },
        role: "staff",
        isActive: true,
      });

      if (staffCount !== uniqueStaffIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more staff IDs are invalid or inactive.",
        });
      }
    }

    const service = await Service.create({
      name: name.trim(),
      description: description?.trim() || "",
      category,
      baseDurationMinutes,
      staffIds: staffIds || [],
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service.",
    });
  }
};

// PATCH /api/services/:id
// Admin only
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "category",
      "baseDurationMinutes",
      "staffIds",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string.",
      });
    }

    if (
      updates.category !== undefined &&
      !["consultation", "follow_up", "diagnostic", "other"].includes(
        updates.category,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid service category.",
      });
    }

    if (
      updates.baseDurationMinutes !== undefined &&
      (!Number.isInteger(updates.baseDurationMinutes) ||
        updates.baseDurationMinutes < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive integer.",
      });
    }

    if (
      updates.description !== undefined &&
      (typeof updates.description !== "string" ||
        updates.description.length > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string of at most 1000 characters.",
      });
    }

    if (updates.staffIds !== undefined) {
      if (
        !Array.isArray(updates.staffIds) ||
        updates.staffIds.some((staffId) => !mongoose.isValidObjectId(staffId))
      ) {
        return res.status(400).json({
          success: false,
          message: "staffIds must be an array of valid user IDs.",
        });
      }

      const uniqueStaffIds = [...new Set(updates.staffIds.map(String))];

      const staffCount = await mongoose.model("User").countDocuments({
        _id: { $in: uniqueStaffIds },
        role: "staff",
        isActive: true,
      });

      if (staffCount !== uniqueStaffIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more staff IDs are invalid or inactive.",
        });
      }

      updates.staffIds = uniqueStaffIds;
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }

    const service = await Service.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Active service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service.",
    });
  }
};

// PATCH /api/services/:id/deactivate
// Admin only
export const deactivateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const service = await Service.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: { isActive: false } },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Active service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deactivated successfully.",
      service,
    });
  } catch (error) {
    console.error("Deactivate service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate service.",
    });
  }
};
