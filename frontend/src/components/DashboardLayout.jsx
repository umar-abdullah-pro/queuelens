import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;