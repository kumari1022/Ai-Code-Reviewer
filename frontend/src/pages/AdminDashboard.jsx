import { useEffect,useState }

from "react";

import axios from "axios";

function AdminDashboard() {

  const [stats,setStats] = useState({});

  const [users,setUsers] = useState([]);

  const [reviews,setReviews] = useState([]);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const headers = {

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      };

      const statsResponse =
        await axios.get(

          "http://localhost:8080/api/admin/stats",

          headers
        );

      const usersResponse =
        await axios.get(

          "http://localhost:8080/api/admin/users",

          headers
        );

      const reviewsResponse =
        await axios.get(

          "http://localhost:8080/api/admin/reviews",

          headers
        );

      setStats(
        statsResponse.data
      );

      setUsers(
        usersResponse.data
      );

      setReviews(
        reviewsResponse.data
      );

    } catch(error) {

      console.error(error);
    }
  };

  const deleteReview = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(

        `http://localhost:8080/api/admin/review/${id}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      fetchDashboard();

    } catch(error) {

      console.error(error);
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-10">

        Admin Dashboard

      </h1>

      <div className="grid grid-cols-2 gap-6 mb-10">

        <div className="bg-slate-900 p-8 rounded-2xl">

          <h2 className="text-2xl">
            Total Users
          </h2>

          <p className="text-5xl font-bold mt-4">

            {stats.totalUsers}

          </p>

        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">

          <h2 className="text-2xl">
            Total Reviews
          </h2>

          <p className="text-5xl font-bold mt-4">

            {stats.totalReviews}

          </p>

        </div>

      </div>

      <div className="bg-slate-900 p-8 rounded-2xl mb-10">

        <h2 className="text-3xl font-bold mb-6">

          Users

        </h2>

        {
          users.map(user => (

            <div
              key={user.id}
              className="border-b border-slate-700 py-4"
            >

              <p>{user.email}</p>

              <p className="text-slate-400">

                {user.role}

              </p>

            </div>
          ))
        }

      </div>

      <div className="bg-slate-900 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-6">

          Reviews

        </h2>

        {
          reviews.map(review => (

            <div
              key={review.id}
              className="border-b border-slate-700 py-4 flex justify-between"
            >

              <div>

                <p>{review.fileName}</p>

              </div>

              <button
                onClick={() =>
                  deleteReview(review.id)
                }
                className="bg-red-600 px-4 py-2 rounded-lg"
              >

                Delete

              </button>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default AdminDashboard;