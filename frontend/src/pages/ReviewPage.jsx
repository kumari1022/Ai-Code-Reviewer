import { useEffect, useState } from "react";

import axios from "axios";

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter";

import { oneDark }
from "react-syntax-highlighter/dist/cjs/styles/prism";
import MetricCard from "../components/MetricCard";

import IssueCard from "../components/IssueCard";

const API_URL = import.meta.env.VITE_API_URL;

function ReviewPage() {

  const [review, setReview] = useState("");

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchReview();

  }, []);

  const fetchReview = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/review/latest`
      );

      setReview(response.data.review);

      setCode(response.data.code);

      setLoading(false);

    } catch (error) {

      console.error(error);
    }
  };

  const metrics = [

    {
      title: "Code Quality",
      value: "92%"
    },

    {
      title: "Complexity",
      value: "Medium"
    },

    {
      title: "Maintainability",
      value: "85%"
    },

    {
      title: "Security Score",
      value: "90%"
    }
  ];

  const issues = [

    {
      severity: "HIGH",
      issue: "Nested loops detected"
    },

    {
      severity: "MEDIUM",
      issue: "Method length too large"
    },

    {
      severity: "LOW",
      issue: "Improve variable naming"
    }
  ];

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-3xl">

        Analyzing Code...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">

          AI Review Dashboard

        </h1>

        {/* METRICS GRID */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          {metrics.map((metric, index) => (

            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
            />

          ))}

        </div>

        {/* ISSUES SECTION */}

        <div className="bg-slate-900 p-6 rounded-2xl mb-10">

          <h2 className="text-3xl font-bold mb-6 text-white">

            AI Detected Issues

          </h2>

          {issues.map((issue, index) => (

            <IssueCard
              key={index}
              severity={issue.severity}
              issue={issue.issue}
            />

          ))}

        </div>

        {/* CODE SECTION */}

        <div className="bg-slate-900 p-6 rounded-2xl mb-10">

          <h2 className="text-3xl font-bold mb-4">

            Uploaded Code

          </h2>

          <SyntaxHighlighter
            language="java"
            style={oneDark}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              borderRadius: "16px",
              padding: "25px",
              fontSize: "15px"
            }}
          >

            {code}

          </SyntaxHighlighter>

        </div>

        {/* AI REVIEW */}

        <div className="bg-slate-900 p-6 rounded-2xl">

          <h2 className="text-3xl font-bold mb-4">

            AI Review

          </h2>

          <p className="text-slate-300 whitespace-pre-wrap leading-8">

            {review}

          </p>

        </div>

      </div>

    </div>
  );
}

export default ReviewPage;