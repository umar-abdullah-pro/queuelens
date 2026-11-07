import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
        QueueLens<span className="text-teal-600">.</span>
      </Link>

      <div className="flex items-center gap-5">
        <Link
          to="/login"
          className="text-sm font-semibold text-slate-700 hover:text-teal-700"
        >
          Sign In
        </Link>

        <Link
          to="/register"
          className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
