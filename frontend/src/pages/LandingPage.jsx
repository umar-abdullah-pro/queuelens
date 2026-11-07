import { Link } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";

const dashboardRoutes = {
  patient: "/patient/dashboard",
  staff: "/staff/dashboard",
  admin: "/admin/dashboard",
};

const features = [
  {
    icon: "📅",
    title: "Easy Appointments",
    description: "Browse available services and book your appointments online.",
  },
  {
    icon: "📍",
    title: "Live Queue Tracking",
    description: "Check your queue position and estimated waiting time.",
  },
  {
    icon: "⚡",
    title: "Digital Check-In",
    description: "Check in digitally and keep track of your visit status.",
  },
];

const steps = [
  {
    number: "01",
    title: "Book an Appointment",
    description: "Choose a healthcare service and schedule your visit.",
  },
  {
    number: "02",
    title: "Check In",
    description: "Check in digitally when you arrive at the healthcare center.",
  },
  {
    number: "03",
    title: "Track Your Queue",
    description: "Follow your queue position while waiting for your turn.",
  },
];

const LandingPage = () => {
  const { user, loading } = useAuth();

  const dashboardPath = user ? dashboardRoutes[user.role] : null;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-teal-800 via-teal-700 to-slate-900">
        {/* Decorative circles */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-teal-400/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          {/* Hero Content */}
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[3px] text-teal-200">
              Smarter Healthcare Management
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Your healthcare visits,
              <span className="text-teal-300"> without the wait.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-200">
              Book appointments, check in digitally, and track your queue in
              real time. QueueLens makes healthcare visits simpler for patients
              and easier for healthcare teams.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              {!loading && dashboardPath ? (
                <Link
                  to={dashboardPath}
                  className="rounded-xl bg-white px-7 py-4 text-sm font-bold text-teal-800 shadow-lg transition hover:-translate-y-1 hover:bg-teal-50"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="rounded-xl bg-white px-7 py-4 text-sm font-bold text-teal-800 shadow-lg transition hover:-translate-y-1 hover:bg-teal-50"
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/login"
                    className="rounded-xl border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <p className="mt-8 text-xs text-teal-100/70">
              Smarter appointments. Better experiences.
            </p>
          </div>

          {/* Queue Preview Card */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-100">
                    Your visit, simplified
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Queue Overview
                  </h2>
                </div>

                <div className="rounded-xl bg-teal-300/20 p-3 text-2xl">✦</div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-slate-500">Appointment Status</p>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-900">
                      Checked In
                    </p>

                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                      Waiting
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">Queue Position</p>

                    <p className="mt-2 text-3xl font-bold text-teal-700">03</p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">Estimated Wait</p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      15 min
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-teal-100">
                Illustrative QueueLens patient experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            Why QueueLens?
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            A Better Experience for Everyone
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Spend less time managing queues and more time focusing on care.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 text-3xl">{feature.icon}</div>

              <h3 className="text-xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
              Simple Process
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              How QueueLens Works
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-xl font-bold text-white shadow-lg shadow-teal-700/20">
                  {step.number}
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-linear-to-r from-teal-800 to-slate-900 px-8 py-16 text-center shadow-xl sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready for a Smarter Healthcare Visit?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-teal-100">
            Create your QueueLens account and make your next appointment
            simpler.
          </p>

          {!loading && (
            <Link
              to={dashboardPath || "/register"}
              className="mt-8 inline-block rounded-xl bg-white px-7 py-4 text-sm font-bold text-teal-800 transition hover:bg-teal-50"
            >
              {dashboardPath ? "Go to Dashboard" : "Create Your Account"}
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xl font-bold text-slate-900">
            QueueLens<span className="text-teal-600">.</span>
          </p>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} QueueLens. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
