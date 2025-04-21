"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CircleX,
  RefreshCcw,
  Send,
  User,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react"; // Added useCallback
import { MarkdownText } from "./markdown/mardown-text-new"; // Assuming this component exists
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

// --- Message Interfaces ---
// Frontend representation of a message
interface ChatMessages {
  role: "human" | "ai";
  content: string;
  isError?: boolean;
  // Add a unique ID for reliable state updates if needed, but index works for simple cases
  // id: string;
}

// SSE data payload structure from backend
interface SSEChunkPayload {
  type: "chunk";
  content: string;
}

interface SSEErrorPayload {
  type: "error";
  content: string; // Error message string
}

// Union type for potential SSE data types
type SSEPayload = SSEChunkPayload | SSEErrorPayload;

// --- Initial Message ---
const initialMessage: ChatMessages = {
  role: "ai",
  content:
    "🌸 Welcome to PetalSoft! I'm **Petal**, your friendly AI assistant. How can I help you today? 💬 You can ask me about our products 🛍️ or check out our FAQ ❓ — and stay tuned, we're adding more features soon! 🚀",
};

// --- Component ---
const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false); // Loading state for sending message & setting up stream
  const [streaming, setStreaming] = useState(false); // State for active SSE streaming
  const [loadingText, setLoadingText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessages[]>([initialMessage]);

  // Refs for DOM elements
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Refs for state that should persist across renders without causing them
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatSessionIdRef = useRef<string | null>(null); // To store the unique session ID
  const eventSourceRef = useRef<EventSource | null>(null); // To hold the SSE connection

  // --- Constants ---
  const loadingSteps = [
    "Thinking...",
    "Processing request...",
    "Generating response...",
  ];

  // --- Effects ---

  // Effect to manage chat session ID on mount and cleanup
  useEffect(() => {
    // Generate session ID only once on initial mount
    if (!chatSessionIdRef.current) {
      chatSessionIdRef.current = uuidv4();
      console.log("Generated new session ID:", chatSessionIdRef.current);
    }

    return () => {
      if (eventSourceRef.current) {
        console.log("Closing SSE connection on component unmount.");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Effect to scroll to the latest message
  useEffect(() => {
    // Only scroll if the popup is open and relevant state changes
    if (isOpen && !loading && !streaming) {
      // Scroll only when content is likely stable
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (isOpen && (loading || streaming)) {
      // Scroll during loading/streaming
      // Scroll *immediately* when new message/chunk is added to ensure visibility
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages.length, isOpen]); // Trigger scroll when a new message is added

  // --- Helper Functions ---

  // Function to update the content of the last AI message during streaming
  const appendToLastAIMessage = useCallback((chunkContent: string) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      // Find the last message
      const lastMessageIndex = updatedMessages.length - 1;
      if (
        lastMessageIndex >= 0 &&
        updatedMessages[lastMessageIndex].role === "ai"
      ) {
        // Append chunk content to the last AI message
        updatedMessages[lastMessageIndex].content += chunkContent;
        // Ensure isError is not set if content is being added
        updatedMessages[lastMessageIndex].isError = false;
      } else {
        // This case shouldn't happen if streaming state is managed correctly,
        // but as a fallback, add a new message
        console.warn(
          "Attempted to append to non-AI or non-existent message. Adding new AI message."
        );
        updatedMessages.push({ role: "ai", content: chunkContent });
      }
      return updatedMessages;
    });
  }, []); // No dependencies, useCallback memoizes the function

  // Function to handle streaming errors
  const handleStreamError = useCallback((errorMessage: string) => {
    console.error("Streaming error:", errorMessage);
    // Stop streaming state
    setStreaming(false);
    // Add an error message to the chat
    setMessages((prevMessages) => {
      // Check if the last message is the empty AI message placeholder
      const lastMessageIndex = prevMessages.length - 1;
      if (
        lastMessageIndex >= 0 &&
        prevMessages[lastMessageIndex].role === "ai" &&
        prevMessages[lastMessageIndex].content === ""
      ) {
        // If it's the empty placeholder, update it to an error message
        const updatedMessages = [...prevMessages];
        updatedMessages[lastMessageIndex].content =
          errorMessage || "An error occurred during streaming.";
        updatedMessages[lastMessageIndex].isError = true;
        return updatedMessages;
      } else {
        // Otherwise, add a new error message
        return [
          ...prevMessages,
          {
            role: "ai",
            content: errorMessage || "An error occurred during streaming.",
            isError: true,
          },
        ];
      }
    });
    // Ensure EventSource is closed if it wasn't already by onerror/end
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []); // No dependencies

  // Function to handle stream completion
  const handleStreamComplete = useCallback(() => {
    console.log("Stream complete.");
    setStreaming(false);
    // Ensure EventSource is closed
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    // The final accumulated message is already in the state via appendToLastAIMessage
  }, []); // No dependencies

  const startLoadingAnimation = () => {
    let stepIndex = 0;
    let animationIndex = 0;
    setLoadingText(loadingSteps[0]);

    // Clear any existing interval before starting a new one
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);

    loadingIntervalRef.current = setInterval(() => {
      if (stepIndex < loadingSteps.length - 1) {
        stepIndex++;
        setLoadingText(loadingSteps[stepIndex]);
      } else {
        const dots = ["●", "● ●", "● ● ●"];
        setLoadingText(
          `Generating response ${dots[animationIndex % dots.length]}`
        );
        animationIndex++;
      }
    }, 1200);
  };

  const stopLoadingAnimation = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
    setLoadingText("");
  };

  // --- Main Send Message Logic ---
  const sendMessage = async () => {
    // Prevent sending if message is empty, already loading, or streaming is active
    if (!message.trim() || loading || streaming) return;

    const userMessage = message;
    const currentChatSessionId = chatSessionIdRef.current;

    if (!currentChatSessionId) {
      console.error("Chat session ID is not set.");
      handleStreamError("Failed to start chat session."); // Use stream error handler for UI consistency
      return;
    }

    // 1. Add user message to state immediately
    setMessages((prev) => [...prev, { role: "human", content: userMessage }]);
    setMessage(""); // Clear input field

    // Auto-resize and focus textarea
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Shrink first
      textAreaRef.current.style.height = "40px"; // Set initial height
      setTimeout(() => textAreaRef.current?.focus(), 0); // Focus after state update
    }

    // 2. Start loading state and animation (waiting for POST)
    setLoading(true);
    startLoadingAnimation();

    try {
      // 3. Send the user message to the backend's send endpoint
      // No history sent here; backend manages state by session ID
      const sendResponse = await axios.post(`/api/chat`, {
        user_message: userMessage, // Backend expects 'question'
        chat_session_id: currentChatSessionId, // Send the session ID
      });

      // Check if the send was successful
      if (sendResponse.status !== 200) {
        // Backend might return a non-200 status with an error message in body
        const errorDetail =
          sendResponse.data?.message || `Error status: ${sendResponse.status}`;
        throw new Error(`Failed to send message: ${errorDetail}`);
      }

      // 4. Stop loading state, start streaming state, stop loading animation
      stopLoadingAnimation(); // Stop POST-specific loading animation
      setLoading(false);
      setStreaming(true); // Indicate streaming is active

      // 5. Add a placeholder AI message for streamed content
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      // 6. Connect to the SSE stream endpoint
      // Ensure any previous connection is closed
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // Construct the SSE stream URL (assuming Next.js route handles proxying and secret)
      const streamUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/petalsoft/stream/${currentChatSessionId}`; // Adjust if your Next.js route path is different

      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      // --- SSE Event Handlers ---

      // Handle incoming messages (data chunks, errors from backend processing)
      eventSource.onmessage = (event) => {
        try {
          const data: SSEPayload = JSON.parse(event.data);

          if (data.type === "chunk") {
            // Append content to the last AI message in state
            appendToLastAIMessage(data.content);
          } else if (data.type === "error") {
            // Handle processing error sent by backend
            handleStreamError(data.content);
            eventSource.close(); // Close connection on backend processing error
          }
        } catch (e) {
          console.error("Failed to parse SSE data:", event.data, e);
          // Handle frontend parsing error
          handleStreamError("Failed to parse response from assistant.");
          eventSource.close(); // Close connection on parsing error
        }
      };

      // Handle the 'end' event specifically (sent by backend after stream is complete)
      eventSource.addEventListener("end", () => {
        handleStreamComplete(); // Set streaming false, close connection
      });

      // Handle generic EventSource errors (connection issues, backend returning non-SSE, etc.)
      eventSource.onerror = (error) => {
        console.error("SSE EventSource error:", error);
        // Attempt to get a useful error message
        const errorMsg =
          (error as any)?.message ||
          (error as any)?.data ||
          "An unknown streaming error occurred.";
        handleStreamError("Streaming connection error: " + errorMsg);
        // The handler calls close() and sets streaming state
      };
    } catch (error: any) {
      // Handle errors during the initial POST request
      console.error("Message send or stream setup failed:", error);
      stopLoadingAnimation();
      setLoading(false);
      setStreaming(false); // Ensure streaming is false
      handleStreamError(
        error.message || "Failed to send message or start chat."
      );

      // Ensure EventSource is closed if it was created but setup failed
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    } finally {
      // stopLoadingAnimation(); // Should be called after POST succeeds or fails
      // setLoading(false); // Should be set after POST succeeds or fails
    }
  };

  // --- New Chat Logic ---
  const startNewChat = () => {
    // Clear local messages
    setMessages([initialMessage]);
    setMessage("");
    // Reset states
    setLoading(false);
    setStreaming(false);
    stopLoadingAnimation();
    // Generate a *new* session ID for the new conversation
    chatSessionIdRef.current = uuidv4();
    console.log("Starting new chat, new session ID:", chatSessionIdRef.current);
    // Close any existing SSE connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    // Focus textarea
    if (textAreaRef.current) {
      setTimeout(() => textAreaRef.current?.focus(), 0);
    }
  };

  // --- Render Logic ---
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-opacity duration-300 ease-in-out ${
                isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Bot size={28} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-foreground text-background">
            <p>Chat with AI Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-[calc(100%+1rem)] right-0 w-[90vw] max-w-[400px] h-[65vh] max-h-[600px] bg-background border rounded-lg shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  AI Assistant
                </span>
                {/* Display connection status/loading */}
                {(loading || streaming) && (
                  <span
                    className={`text-xs ${loading ? "text-muted-foreground animate-pulse" : "text-green-600 dark:text-green-400"}`}
                  >
                    {loading ? loadingText || "Connecting..." : "Live"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="text-xs h-7 px-2"
                  disabled={loading || streaming} // Disable during ongoing process
                >
                  <RefreshCcw size={14} className="mr-1" />
                  New Chat
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground h-7 w-7"
                >
                  <CircleX size={18} />
                  <span className="sr-only">Close chat</span>
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto bg-muted/20">
              <div className="p-4 space-y-4">
                {/* Render initial message separately if needed, or include in main messages array */}
                {/* Updated rendering logic */}
                {messages.map((msg, i) => {
                  const isError = msg.isError;
                  const isInitial = msg === initialMessage; // Check if it's the initial message

                  return (
                    <div
                      key={i} // Using index as key is ok here if list order doesn't change except appending
                      className={`flex items-start gap-3 ${
                        msg.role === "human"
                          ? "justify-end pl-8"
                          : "justify-start pr-8"
                      }`}
                    >
                      {/* Bot Icon for AI messages */}
                      {(msg.role === "ai" || isInitial) && (
                        <div className="p-1.5 bg-muted rounded-full mt-1 flex-shrink-0">
                          {/* Show Alert icon if AI message is an error */}
                          {isError ? (
                            <AlertTriangle
                              size={16}
                              className="text-destructive"
                            />
                          ) : (
                            <Bot size={16} className="text-muted-foreground" />
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] p-3 rounded-lg text-sm break-words ${
                          msg.role === "human"
                            ? "bg-primary text-primary-foreground"
                            : isError
                              ? "bg-destructive/10 border border-destructive/30 text-destructive"
                              : "bg-background border"
                        }`}
                      >
                        <MarkdownText>{msg.content}</MarkdownText>
                      </div>

                      {/* User Icon for Human messages */}
                      {msg.role === "human" && (
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full mt-1 flex-shrink-0 order-last">
                          <User
                            size={16}
                            className="text-blue-700 dark:text-blue-300"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Loading Indicator Row - Show only if loading (POST) or streaming (SSE) */}
                {(loading || streaming) &&
                  // Only show if the LAST message is NOT a non-empty AI message
                  // This prevents the loading text from jumping below the partially streamed message
                  !(
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "ai" &&
                    messages[messages.length - 1].content.length > 0
                  ) && (
                    <div className="flex items-start gap-3 pr-8">
                      <div className="p-1.5 bg-muted rounded-full mt-1 flex-shrink-0">
                        <Bot size={16} className="text-muted-foreground" />
                      </div>
                      <div className="max-w-[85%] p-3 bg-background border rounded-lg flex items-center gap-2 text-sm">
                        <span
                          className={`animate-pulse ${loading ? "text-muted-foreground" : "text-green-600 dark:text-green-400"}`}
                        >
                          {loading
                            ? loadingText || "..."
                            : "Connecting stream..."}
                        </span>
                      </div>
                    </div>
                  )}
                <div ref={messagesEndRef} /> {/* Scroll anchor */}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>

            <div className="p-3 border-t bg-background flex-shrink-0">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={textAreaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    // Auto-resize textarea height
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(
                      e.target.scrollHeight,
                      100 // Max height
                    )}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 resize-none overflow-y-auto text-sm min-h-[40px] max-h-[100px] leading-tight focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                  rows={1}
                  disabled={loading || streaming} // Disable input while sending or streaming
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim() || loading || streaming} // Disable if no message, loading, or streaming
                  size="icon"
                  className="h-10 w-10 flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={18} />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPopup;
