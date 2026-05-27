import { useEffect, useState } from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

import HistoryCard from "../components/HistoryCard";

function HistoryPage() {

  const [reviews,setReviews] = useState([]);

  useEffect(() => {

    fetchReviews();

  }, []);

  const fetchReviews = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/api/review/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReviews(response.data);

    } catch(error) {

      console.error(error);
    }
  };

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold text-white mb-10">

          Review History

        </h1>

        {
          reviews.map((review) => (

        <HistoryCard
          key={review.id}
          fileName={review.fileName}
          createdAt={review.createdAt}
          onOpen={() =>

            window.location.href =
              `/review/${review.id}`
          }
        />

          ))
        }

      </div>

    </div>
  );
}

export default HistoryPage;