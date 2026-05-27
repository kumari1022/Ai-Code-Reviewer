import { useState } from "react";

import axios from "axios";

import ReactMarkdown from "react-markdown";

import { ClipLoader }

from "react-spinners";

function ChatPage() {

  const [message,setMessage] = useState("");

  const [messages,setMessages] = useState([]);

  const [loading,setLoading] = useState(false);

  const sendMessage = async () => {

    if(!message.trim()) return;

    const userMessage = {

      sender: "user",

      text: message
    };

    setMessages(prev => [

      ...prev,
      userMessage
    ]);

    setLoading(true);

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.post(

        "http://localhost:8080/api/chat",

        {
          message: message
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const aiMessage = {

        sender: "ai",

        text: response.data
      };

      setMessages(prev => [

        ...prev,
        aiMessage
      ]);

      setMessage("");

    } catch(error) {

      console.error(error);
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      <div className="p-6 border-b border-slate-800">

        <h1 className="text-4xl font-bold">

          AI Assistant

        </h1>

      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {
          messages.map((msg,index) => (

            <div
              key={index}
              className={

                msg.sender === "user"

                ? "bg-blue-600 p-4 rounded-2xl mb-4 ml-auto max-w-[70%]"

                : "bg-slate-800 p-4 rounded-2xl mb-4 max-w-[70%]"
              }
            >

              <ReactMarkdown>

                {msg.text}

              </ReactMarkdown>

            </div>
          ))
        }

        {
          loading && (

            <div className="flex justify-center mt-6">

              <ClipLoader
                color="white"
                size={40}
              />

            </div>
          )
        }

      </div>

      <div className="p-6 border-t border-slate-800 flex gap-4">

        <input
          type="text"
          placeholder="Ask AI anything..."
          value={message}
          onChange={(e) =>

            setMessage(e.target.value)
          }
          className="flex-1 bg-slate-900 p-4 rounded-xl outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-8 rounded-xl"
        >

          Send

        </button>

      </div>

    </div>
  );
}

export default ChatPage;