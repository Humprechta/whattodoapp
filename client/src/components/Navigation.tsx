import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="drawer lg:drawer-open">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" checked={open} onChange={() => setOpen(!open)} />
      <div className="drawer-content flex flex-col">
        <button
          className="btn btn-primary m-4 lg:hidden"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>

        <div className="container">
          <Outlet /> {/* Route Component child routs*/}
        </div>
        
      </div>
      <div className="drawer-side">
        <label htmlFor="nav-drawer" className="drawer-overlay"></label>
        <nav className="w-64 min-h-screen bg-base-200 p-5 shadow-lg">
          <h2 className="text-xl font-bold text-center mb-6">📌 My App</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`block p-3 rounded-lg hover:bg-base-300 hover:text-black transition ${
                  location.pathname === "/" ? "bg-primary text-white" : ""
                }`}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={`block p-3 rounded-lg hover:bg-base-300 hover:text-black transition ${
                  location.pathname === "/tasks" ? "bg-primary text-white" : ""
                }`}
              >
                📝 Tasks
              </Link>
            </li>
            {location.pathname.includes("/activities") && (
              <li className="pl-5">
                <span className="block p-2 rounded-lg bg-secondary text-white">
                  ➜ 🏃 Activity
                </span>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
