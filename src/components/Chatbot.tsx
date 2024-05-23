"use client";
import axios from "axios";
import { Bot, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: message,
        max_tokens: 60,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    setResponses((prevResponses) => [
      ...prevResponses,
      response.data.choices[0].text,
    ]);
    setMessage("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-xl flex justify-end">
      <Button
        className="rounded-full self-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot size={24} />
      </Button>
      {isOpen && (
        <div
          className="absolute bottom-[120%] right-[45%] transform translate-x-1/2 
        w-[90%] max-w-[500px] h-[600px] bg-zinc-400/90 rounded shadow flex flex-col"
        >
          <div className="overflow-auto p-4">
            {responses.map((response, index) => (
              <p key={index}>{response}</p>
            ))}
          </div>
          <div className="p-3 flex mt-auto">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow mr-2 rounded-lg pl-2 h-10 border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button onClick={sendMessage}>
              <Send className="rotate-45" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
