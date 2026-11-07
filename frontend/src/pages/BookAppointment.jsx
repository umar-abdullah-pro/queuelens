import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const BookAppointment = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    serviceId: "",
    scheduledAt: "",
    notes: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api("/services");
        setServices(data.services || []);
      } catch (error) {
        setError(error.message || "Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.serviceId || !formData.scheduledAt) {
      setError("Please select a service, date and time.");
      return;
    }

    const scheduledDate = new Date(formData.scheduledAt);

    if (scheduledDate <= new Date()) {
      setError("Please select a future date and time.");
      return;
    }

    try {
      setSubmitting(true);

      await api("/appointments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: formData.serviceId,
          scheduledAt: scheduledDate.toISOString(),
          notes: formData.notes,
        }),
      });

      navigate("/patient/dashboard");
    } catch (error) {
      setError(error.message || "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-slate-500">Loading services...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="mb-8">
        <Link
          to="/patient/dashboard"
          className="text-sm font-semibold text-teal-700"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Book Appointment
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Select a service and choose your preferred appointment time.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="rounded-xl border bg-white p-6">
          <p className="font-semibold text-slate-800">
            No services are currently available.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Please check again later.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Select Service
            </label>

            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            >
              <option value="">Choose a service</option>

              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} ({service.baseDurationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Appointment Date and Time
            </label>

            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Additional Notes (Optional)
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              placeholder="Any additional information..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookAppointment;
