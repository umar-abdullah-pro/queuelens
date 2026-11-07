import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingIn, setCheckingIn] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await api("/appointments/mine");
      setAppointments(res.appointments || []);
      setError("");
    } catch (error) {
      setError(error.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and automatic refresh
  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update current time for check-in availability
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Check-in appointment
  const handleCheckIn = async (appointmentId) => {
    try {
      setCheckingIn(appointmentId);
      setError("");

      await api(`/appointments/${appointmentId}/check-in`, {
        method: "PATCH",
      });

      await fetchAppointments();
    } catch (error) {
      setError(error.message || "Check-in failed.");
      await fetchAppointments();
    } finally {
      setCheckingIn(null);
    }
  };

  // Check-in availability
  const canCheckIn = (appointment) => {
    if (appointment.status !== "BOOKED") return false;

    const scheduledTime = new Date(appointment.scheduledAt);
    const deadline = new Date(scheduledTime.getTime() + 15 * 60 * 1000);

    return currentTime >= scheduledTime && currentTime <= deadline;
  };

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    try {
      setCancelling(appointmentId);
      setError("");

      await api(`/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
      });

      await fetchAppointments();
    } catch (error) {
      setError(error.message || "Failed to cancel appointment.");
    } finally {
      setCancelling(null);
    }
  };

  // Toggle appointment details
  const toggleAppointmentDetails = (appointmentId) => {
    setExpandedAppointment((current) =>
      current === appointmentId ? null : appointmentId,
    );
  };

  // Summary calculations
  const totalAppointments = appointments.length;

  const upcomingAppointments = appointments.filter((appointment) =>
    ["BOOKED", "CHECKED_IN", "IN_PROGRESS"].includes(appointment.status),
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;

  // Status styling
  const getStatusStyle = (status) => {
    const styles = {
      BOOKED: "bg-amber-100 text-amber-700",
      CHECKED_IN: "bg-sky-100 text-sky-700",
      IN_PROGRESS: "bg-violet-100 text-violet-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-rose-100 text-rose-700",
      NO_SHOW: "bg-slate-200 text-slate-700",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status) => {
    const labels = {
      BOOKED: "Booked",
      CHECKED_IN: "Checked In",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      NO_SHOW: "No Show",
    };

    return labels[status] || status;
  };

  // Date formatting
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Time formatting
  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="px-2 py-6 sm:px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-teal-700">
              Patient Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Welcome back!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your appointments and keep track of your visits.
            </p>
          </div>

          <Link
            to="/patient/book-appointment"
            className="rounded-xl bg-teal-700 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-teal-800"
          >
            + Book Appointment
          </Link>
        </div>

        {/* Loading and Error */}
        {loading ? (
          <p className="mt-10 text-sm text-slate-500">
            Loading your appointments...
          </p>
        ) : error && appointments.length === 0 ? (
          <div className="mt-10 rounded-xl bg-rose-50 p-5 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            {/* Summary Cards */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Total Appointments</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {totalAppointments}
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Upcoming Appointments</p>
                <h2 className="mt-3 text-3xl font-bold text-sky-600">
                  {upcomingAppointments}
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Completed Visits</p>
                <h2 className="mt-3 text-3xl font-bold text-green-600">
                  {completedAppointments}
                </h2>
              </div>
            </div>

            {/* Appointments */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  My Appointments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your appointments.
                </p>
              </div>

              {appointments.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
                  <p className="font-semibold text-slate-800">
                    No appointments yet.
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Book your first appointment to get started.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Service</th>
                          <th className="px-6 py-4 font-semibold">Date</th>
                          <th className="px-6 py-4 font-semibold">Time</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {appointments.map((appointment) => (
                          <React.Fragment key={appointment._id}>
                            <tr className="hover:bg-slate-50">
                              <td className="px-6 py-5 font-semibold text-slate-800">
                                {appointment.serviceId?.name || "Service"}
                              </td>

                              <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                                {formatDate(appointment.scheduledAt)}
                              </td>

                              <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                                {formatTime(appointment.scheduledAt)}
                              </td>

                              <td className="px-6 py-5">
                                <span
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                                    appointment.status,
                                  )}`}
                                >
                                  {getStatusLabel(appointment.status)}
                                </span>
                              </td>

                              <td className="px-6 py-5">
                                <div className="flex flex-col items-start gap-3">
                                  <button
                                    onClick={() =>
                                      toggleAppointmentDetails(appointment._id)
                                    }
                                    className="text-sm font-semibold text-teal-700 hover:text-teal-900"
                                  >
                                    {expandedAppointment === appointment._id
                                      ? "Hide Details"
                                      : "View Details"}
                                  </button>

                                  {appointment.status === "BOOKED" && (
                                    <button
                                      onClick={() =>
                                        handleCancelAppointment(appointment._id)
                                      }
                                      disabled={cancelling === appointment._id}
                                      className="text-sm font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50"
                                    >
                                      {cancelling === appointment._id
                                        ? "Cancelling..."
                                        : "Cancel"}
                                    </button>
                                  )}

                                  {canCheckIn(appointment) && (
                                    <button
                                      onClick={() =>
                                        handleCheckIn(appointment._id)
                                      }
                                      disabled={checkingIn === appointment._id}
                                      className="rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                                    >
                                      {checkingIn === appointment._id
                                        ? "Checking in..."
                                        : "Check In"}
                                    </button>
                                  )}

                                  {appointment.status === "CHECKED_IN" && (
                                    <span className="text-xs font-semibold text-sky-700">
                                      Checked In
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Expandable Appointment Details */}
                            {expandedAppointment === appointment._id && (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="bg-slate-50 px-6 py-5"
                                >
                                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Appointment ID
                                      </p>
                                      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                                        {appointment._id}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Service
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {appointment.serviceId?.name || "—"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Category
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {appointment.serviceId?.category || "—"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Scheduled Date
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {formatDate(appointment.scheduledAt)}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Scheduled Time
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {formatTime(appointment.scheduledAt)}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Current Status
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {getStatusLabel(appointment.status)}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Assigned Staff
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {appointment.assignedStaffId?.name ||
                                          "Not assigned"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-slate-500">
                                        Actual Duration
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {appointment.actualDurationMinutes !=
                                        null
                                          ? `${appointment.actualDurationMinutes} minutes`
                                          : "Not completed"}
                                      </p>
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-3">
                                      <p className="text-xs font-medium text-slate-500">
                                        Notes
                                      </p>
                                      <p className="mt-1 text-sm text-slate-700">
                                        {appointment.notes ||
                                          "No additional notes."}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
