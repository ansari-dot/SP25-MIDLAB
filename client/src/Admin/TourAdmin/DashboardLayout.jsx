import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import "./dashboard.css";
import TourPackages from "./TourPackage";
import Customers from "./Customers.jsx";
import Destinations from "./Destinations";
import Bookings from "./Bookings.jsx";
import Settings from "./Settings";

const SIDEBAR_ITEMS = [
  { key: "tour-packages", label: "Tour Packages", icon: "bi-box" },
  { key: "customers", label: "Customers", icon: "bi-people" },
  { key: "destinations", label: "Destinations", icon: "bi-map" },
  { key: "bookings", label: "Bookings", icon: "bi-calendar" },
  { key: "settings", label: "Settings", icon: "bi-gear" },
];

export default function DashboardLayout() {
  const [active, setActive] = useState("tour-packages");
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = cookies.user;
    setData(cookies.user);
    // Check if user or token is missing
    if (!cookies.token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "TourManager") {
      navigate("/unauthorized");
    }
  }, [cookies, navigate]);
  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    removeCookie("user", { path: "/" });

    // Clear user data from state
    setData({});

    // Redirect to login page
    navigate("/login", { replace: true });

    // After navigating, ensure back button doesn't work
    window.history.replaceState(null, "", "/login");
    window.onpopstate = () => {
      window.history.go(1); // Prevent going back
    };
  };

  function renderContent() {
    switch (active) {
      case "tour-packages":
        return <TourPackages />;
      case "customers":
        return <Customers />;
      case "destinations":
        return <Destinations />;
      case "bookings":
        return <Bookings />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  }

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="dashboard-profile-photo">
          <img src={data.profilePhoto} alt="Profile" />
        </div>
        <h2 className="dashboard-title">{data.name}</h2>
        <nav>
          <ul>
            {SIDEBAR_ITEMS.map((item) => (
              <li
                key={item.key}
                className={active === item.key ? "active" : ""}
                onClick={() => setActive(item.key)}>
                <i className={`bi ${item.icon}`}></i> {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <button className="dashboard-logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </aside>
      <main className="dashboard-main">{renderContent()}</main>
    </div>
  );
}
