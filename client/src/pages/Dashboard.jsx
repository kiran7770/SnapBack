import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HeroImg from "../images/hero.avif";
import "./Dashboard.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [voteData, setVoteData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.includes("stories")
    ? "stories"
    : "mockups";

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mockups/stats")
      .then((res) => setVoteData(res.data))
      .catch(() => alert("Error loading vote stats"));
  }, []);

  const chartData = {
    labels: voteData.map((d) => d.title),
    datasets: [
      {
        label: "Yes Votes",
        data: voteData.map((d) => d.yes_votes),
        backgroundColor: "#10b981", // green
      },
      {
        label: "No Votes",
        data: voteData.map((d) => d.no_votes),
        backgroundColor: "#ef4444", // red
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Feedback Summary by Feature",
        font: { size: 18 },
        color: "#333",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#333",
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Votes",
          color: "#666",
          font: { size: 14 },
        },
      },
      x: {
        ticks: { color: "#333" },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Welcome to Your Dashboard</h1>
          <p>
            Explore how mockups and user stories are performing based on
            community feedback.
          </p>
        </div>
        <img src={HeroImg} alt="Hero" className="hero-image" />
      </section>

      {/* Tabs */}
      <div className="tab-buttons">
        <button
          className={activeTab === "mockups" ? "tab active" : "tab"}
          onClick={() => navigate("/dashboard/mockups")}
        >
          Mockups
        </button>
        <button
          className={activeTab === "stories" ? "tab active" : "tab"}
          onClick={() => navigate("/dashboard/stories")}
        >
          User Stories
        </button>
      </div>

      {/* Nested content */}
      <Outlet />

      {/* Chart */}
      <section className="section chart-section">
        <h2 className="section-title">Feedback Chart</h2>
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
