
import { useEffect, useState } from "react";
import { api } from "../services/api";

function BookAppointment() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api("/services");
        setServices(data.services || []);
      } catch (err) {
        setError(err.message || "Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedService || !scheduledAt) {
      setError("Please select a service and appointment time.");
      return;
    }

    // We'll connect the booking API in the next step.
    setError("");
    alert("Form details are ready. Booking will be connected next.");
  };

  if (loading) {
    return <p className="text-slate-500">Loading services...</p>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">
        Book an Appointment
      </h1>

      <p className="mt-2 text-slate-500">
        Select a service and choose your preferred appointment time.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {services.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No services are currently available.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Select Service
            </label>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
              required
            >
              <option value="">Choose a service</option>

              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Appointment Date and Time
            </label>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Notes (Optional)
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Add any information relevant to your appointment..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-teal-700 px-6 py-3 font-medium text-white transition hover:bg-teal-800"
          >
            Continue
          </button>
        </form>
      )}
    </div>
  );
}

export default BookAppointment;
