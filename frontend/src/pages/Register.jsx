import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.target);

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          password: formData.get("password"),
        }),
      });

      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-slate-300/50 md:min-h-[620px] md:grid-cols-2">
        {/* Branding panel */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 p-8 text-white sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-teal-400/10" />

          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight">
              QueueLens<span className="text-teal-300">.</span>
            </h1>
          </div>

          <div className="relative z-10 my-12">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[3px] text-teal-200">
              Get started today
            </p>

            <h2 className="max-w-md text-4xl font-bold leading-tight sm:text-5xl">
              Better visits.
              <br />
              <span className="text-teal-300">Less waiting.</span>
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-200">
              Create your account to book appointments and keep track of your
              queue in one place.
            </p>
          </div>

          <p className="relative z-10 text-xs text-teal-200/80">
            Smarter appointments. Better experiences.
          </p>
        </section>

        {/* Registration panel */}
        <section className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-700">
                Create Account
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Join QueueLens
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter your details to create your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone number{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password (minimum 8 characters)"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-50"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-teal-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="my-6 border-t border-slate-100" />

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-teal-700 hover:text-teal-900"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
