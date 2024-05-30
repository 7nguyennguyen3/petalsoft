"use client";
import axios from "axios";
import { Bot, CircleX, Send, User } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "./ui/scroll-area";

const Chatbot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const requestData = {
    question: userMessage,
    ...(sessionId && { overrideConfig: { sessionId } }),
  };

  const useOnClickOutside = (
    ref: RefObject<HTMLElement>,
    handler: (event: Event) => void
  ) => {
    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  const chatboxRef = useRef(null);
  useOnClickOutside(chatboxRef, () => setIsOpen(false));

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-xl flex justify-end">
      <Button
        className="rounded-full self-end"
        onClick={(event) => {
          event.stopPropagation();
          setCount(count + 1);
          setIsOpen(count % 2 === 0);
        }}
      >
        <Bot size={28} />
      </Button>
      {isOpen && (
        <div
          ref={chatboxRef}
          className="absolute bottom-[120%] right-[45%] transform translate-x-1/2 
        w-[90%] max-w-[500px] h-[75vh] xs:max-h-[800px] sm:max-h-[700px] bg-zinc-500/80 rounded shadow flex flex-col xs:p-1 sm:p-3"
        >
          <div className="flex justify-between p-2">
            <Button
              variant="outline"
              onClick={() => {
                setMessages([]);
                setSessionId("");
              }}
              className="p-2 bg-transparent border-red-900 border-2 text-red-900"
            >
              Clear Chat
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
              }}
              className="p-2"
            >
              <CircleX size={30} />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4">
            <div className="bg-white text-black rounded-lg p-5 my-2 max-w-max self-start relative text-sm">
              Hello! 🌸 I'm Petal, your beauty and fragrance guide. How can I
              assist you today?
              <Bot
                size={28}
                className="absolute bottom-[-10px] left-[-2px] text-[30px]"
              />
            </div>
            {messages.map((message, index) => {
              const isUserMessage = index % 2 === 0;
              return (
                <div
                  className={`${
                    isUserMessage
                      ? "bg-blue-600 text-white rounded-lg p-4 my-2 max-w-max ml-auto"
                      : "bg-white text-black rounded-lg p-4 my-2 max-w-max mr-auto"
                  } relative my-6 text-sm`}
                  key={index}
                >
                  <ReactMarkdown>{message}</ReactMarkdown>
                  {isUserMessage ? (
                    <User
                      size={28}
                      className="absolute bottom-[-12px] right-[-2px]"
                    />
                  ) : (
                    <Bot
                      size={28}
                      className="absolute bottom-[-10px] left-[-2px] text-[30px]"
                    />
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </ScrollArea>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (isLoading) return;

              setIsLoading(true);
              setMessages((prev) => [...prev, userMessage]);
              setUserMessage("");

              setTimeout(async () => {
                setMessages((prev) => [...prev, "Formulating a response..."]);

                try {
                  const { data } = await axios.post(
                    "/api/chatbot",
                    requestData
                  );
                  setSessionId(data.sessionId);
                  setMessages((prev) => {
                    const newMessages = prev.filter(
                      (message) => message !== "Formulating a response..."
                    );
                    return [...newMessages, data.text];
                  });
                  console.log(data);
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsLoading(false);
                }
              }, 500);
            }}
            className="grid grid-cols-1 sm:grid-cols-[9fr_1fr] gap-2 items-center p-3"
          >
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-grow mr-2 rounded-lg pl-2 pr-4 h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
            />
            <Button type="submit" className="w-full md:w-auto">
              <Send className="rotate-45" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
