import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import { Prism as SyntaxHighlighter }

from "react-syntax-highlighter";

import { oneDark }

from "react-syntax-highlighter/dist/cjs/styles/prism";

function DetailedReviewPage() {

  const { id } = useParams();

  const [review,setReview] = useState(null);

  useEffect(() => {

    fetchReview();

  }, []);

  const fetchReview = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(

        `http://localhost:8080/api/review/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReview(response.data);

    } catch(error) {

      console.error(error);
    }
  };

  if(!review) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-3xl">

        Loading Review...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-10">

        {review.fileName}

      </h1>

      <div className="bg-slate-900 rounded-2xl p-6 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          Uploaded Code
        </h2>

        <SyntaxHighlighter
          language="java"
          style={oneDark}
          showLineNumbers={true}
        >

          {review.content}

        </SyntaxHighlighter>

      </div>

      <div className="bg-slate-900 rounded-2xl p-6">

        <h2 className="text-3xl font-bold mb-6">
          AI Review
        </h2>

        <p className="text-slate-300 whitespace-pre-wrap leading-8">

          {review.review}

        </p>

      </div>

    </div>
  );
}

export default DetailedReviewPage;