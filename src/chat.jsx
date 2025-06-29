import { useState, useRef, useEffect } from "react";
import "./chat.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [showChat, setShowChat] = useState(false); // State to control showing chat interface
  const [isLoading, setIsLoading] = useState(false); // State for the loading spinner
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  useEffect(() => {
    if (!showMessage) {
      setTimeout(() => setShowMessage(true), 100); // Delay to start typing animation after component load
    }
  }, [showMessage]);


  // Show "Get Started" screen
  if (!showChat) {
    return (
      <div className="fixed inset-0 flex h-screen w-full relative overflow-hidden">
        {/* Animated Gradient Background with Modern Blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7247e9] via-[#da0e7f] to-[#9b4eff] opacity-90 animate-gradient">
  <div className="absolute inset-0 backdrop-blur-2xl"></div>
</div>
  
        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center w-full gap-12 px-12">
          {/* Right Section: Logo with Slide In Animation */}
          <div className="flex-shrink-0 animate-slide-in-left">
            <img src="/chatty.png" alt="Chat AI Logo" className="w-96 h-96" />
          </div>
  
          {/* Left Section: Welcome Message with Fade In */}
          <div className="text-left flex flex-col items-start animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to Chatty AI!</h1>
            <p className="text-gray-200 mb-8">
              Click below to start chatting with our AI assistant.
            </p>
  
            {/* Sliding Get Started Button with Hover Animation */}
            <button
              className="relative px-6 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 group overflow-hidden transition-transform duration-300"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setShowChat(true), 2000); // 2-second delay for loading spinner animation
              }}
              disabled={isLoading} // Disable button while loading
            >
              <span
                className="absolute inset-0 bg-white opacity-20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"
              ></span>
              <span className="relative z-10">
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
                ) : (
                  "Get Started"
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Chat Interface
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-[#7247e9] via-[#da0e7f] to-[#7247e9] opacity-80 animate-gradient">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Fixed Header */}
        <header className="flex items-center justify-center py-4">
    <img src="/chatty.png" alt="Chat AI Logo" className="w-12 h-12 mr-2" />
    <h1 className="text-4xl font-bold text-white">Chatty AI</h1>
</header>

        {/* Scrollable Chat Container */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 rounded-xl bg-white shadow-lg p-6 hide-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <h2 className="text-3xl font-semibold text-purple-600 mb-4">
                <span className={`typing-animation ${showMessage ? "show" : ""}`}>
                  Welcome to Chatty AI!
                </span>
              </h2>
            
          </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`mb-4 ${chat.type === "question" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block max-w-[80%] p-4 rounded-xl overflow-auto shadow-sm ${
                      chat.type === "question"
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-br-none"
                        : "bg-pink-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown className="overflow-auto">{chat.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          )}

          {generatingAnswer && (
            <div className="flex justify-start items-center text-left">
              <div className="inline-flex items-center space-x-2">
                <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form onSubmit={generateAnswer} className="bg-white rounded-2xl shadow-xl p-5 border border-gray-200">
          <div className="flex gap-3">
            <textarea
              required
              className="flex-1 border border-gray-300 rounded-xl p-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 resize-none shadow-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Message ChattyAI"
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-8 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-pink-500 hover:to-purple-500 transition-all duration-200 transform hover:scale-105 ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;