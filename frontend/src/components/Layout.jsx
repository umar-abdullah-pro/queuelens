import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { user } = useOutletContext();

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar user={user} />

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
