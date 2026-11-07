import Appointment from "../models/Appointment.js";

const updateNoShowAppointments = async () => {
  try {
    const gracePeriodMinutes = 15;
    const cutoffTime = new Date(Date.now() - gracePeriodMinutes * 60 * 1000);
    const result = await Appointment.updateMany(
      {
        status: "BOOKED",
        scheduledAt: { $lte: cutoffTime },
      },
      {
        $set: { status: "NO_SHOW" },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} appointment(s) marked as NO_SHOW`);
    }
  } catch (error) {
    console.error("Failed to update NO_SHOW appointments:", error);
  }
};

export default updateNoShowAppointments;
