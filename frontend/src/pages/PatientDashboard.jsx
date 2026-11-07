import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiCheckCircle, FiActivity } from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function PatientDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await api("/appointments/mine");
        setAppointments(data.appointments || []);
      } catch (err) {
        setError(err.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const now = new Date();

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "BOOKED" &&
      new Date(appointment.scheduledAt) >= now,
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  );

  const checkedInAppointments = appointments.filter(
    (appointment) => appointment.status === "CHECKED_IN",
  );

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
    .slice(0, 5);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusStyles = {
    BOOKED: "bg-blue-50 text-blue-700",
    CHECKED_IN: "bg-amber-50 text-amber-700",
    IN_PROGRESS: "bg-purple-50 text-purple-700",
    COMPLETED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
    NO_SHOW: "bg-slate-100 text-slate-600",
  };

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: FiCalendar,
      color: "text-teal-700",
      background: "bg-teal-50",
    },
    {
      title: "Upcoming",
      value: upcomingAppointments.length,
      icon: FiClock,
      color: "text-blue-700",
      background: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedAppointments.length,
      icon: FiCheckCircle,
      color: "text-green-700",
      background: "bg-green-50",
    },
    {
      title: "Checked In",
      value: checkedInAppointments.length,
      icon: FiActivity,
      color: "text-amber-700",
      background: "bg-amber-50",
    },
  ];

  if (loading) {
    return (
      <div className="py-10 text-center text-slate-500">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-teal-700">Patient Dashboard</p>

        <h1 className="mt-1 text-3xl font-bold text-slate-800">
          Welcome, {user?.name || "Patient"}
        </h1>

        <p className="mt-2 text-slate-500">
          Here's an overview of your appointments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.title}</p>

                <div className={`rounded-lg p-3 ${stat.background}`}>
                  <Icon className={stat.color} size={20} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-800">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Upcoming Appointments
        </h2>

        {upcomingAppointments.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            You don't have any upcoming appointments.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col justify-between gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-medium text-slate-800">
                    {appointment.serviceId?.name || "Service"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(appointment.scheduledAt)} at{" "}
                    {formatTime(appointment.scheduledAt)}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  BOOKED
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Appointments */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Appointments
        </h2>

        {recentAppointments.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No appointments found. Your appointments will appear here.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-150 text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Staff</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-4 text-sm font-medium text-slate-800">
                      {appointment.serviceId?.name || "Service"}
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      {formatDate(appointment.scheduledAt)}
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      {appointment.assignedStaffId?.name || "Not assigned"}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[appointment.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default PatientDashboard;
