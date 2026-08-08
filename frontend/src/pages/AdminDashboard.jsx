import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  FileText,
  Trash2,
  Shield,
  Key,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReviews: 0,
  });

  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const statsResponse = await axios.get(
        `${API_URL}/api/admin/stats`,
        headers
      );

      const usersResponse = await axios.get(
        `${API_URL}/api/admin/users`,
        headers
      );

      const reviewsResponse = await axios.get(
        `${API_URL}/api/admin/reviews`,
        headers
      );

      setStats(statsResponse.data || {
        totalUsers: 0,
        totalReviews: 0,
      });

      setUsers(usersResponse.data || []);
      setReviews(reviewsResponse.data || []);
    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review permanently?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/admin/review/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review deleted successfully");
      fetchDashboard();
    } catch (error) {
      console.error("Error deleting review", error);
      alert("Delete failed");
    }
  };

  return (
    <>
      {/* Mee remaining JSX same ga untundi */}
    </>
  );
}

export default AdminDashboard;