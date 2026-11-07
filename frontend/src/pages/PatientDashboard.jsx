import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const appointments = [
    {
      id: 1,
      service: "General Consultation",
      date: "07 Nov 2026",
      time: "10:30 AM",
      status: "CHECKED_IN",
      queuePosition: 3,
      waitTime: 15,
    },
    {
      id: 2,
      service: "Blood Test",
      date: "10 Nov 2026",
      time: "11:00 AM",
      status: "BOOKED",
      queuePosition: null,
      waitTime: null,
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "CHECKED_IN":
        return "bg-sky-100 text-sky-700";

      case "IN_PROGRESS":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-slate-100 text-slate-700";

      case "CANCELLED":
        return "bg-rose-100 text-rose-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
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
            className="rounded-xl bg-teal-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            + Book Appointment
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Appointments</p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">05</h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Upcoming Appointments</p>

            <h2 className="mt-3 text-3xl font-bold text-sky-600">02</h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed Visits</p>

            <h2 className="mt-3 text-3xl font-bold text-green-600">03</h2>
          </div>
        </div>

        {/* Current Queue Status */}
        <section className="mt-10 rounded-2xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-teal-700">
                CURRENT QUEUE STATUS
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                General Consultation
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                You are currently checked in and waiting for your turn.
              </p>
            </div>

            <span className="w-fit rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              Waiting
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-slate-500">Queue Position</p>

              <h3 className="mt-2 text-3xl font-bold text-teal-700">#03</h3>
            </div>

            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-slate-500">Estimated Wait</p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">15 min</h3>
            </div>

            <div className="col-span-2 rounded-xl bg-white p-5 sm:col-span-1">
              <p className="text-sm text-slate-500">Service Status</p>

              <h3 className="mt-2 text-lg font-bold text-sky-600">Waiting</h3>
            </div>
          </div>
        </section>

        {/* Appointments */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                My Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage your recent appointments.
              </p>
            </div>

            <button className="text-sm font-semibold text-teal-700 hover:text-teal-900">
              View All
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Service</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-slate-50">
                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {appointment.service}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                        {appointment.date}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                        {appointment.time}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {appointment.status === "CHECKED_IN" ? (
                          <span className="font-semibold text-teal-700">
                            Track Queue
                          </span>
                        ) : (
                          <span className="text-slate-400">View Details</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;
