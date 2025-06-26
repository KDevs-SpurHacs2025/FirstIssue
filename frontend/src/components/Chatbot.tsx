import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

interface ChatbotProps {
  userId: string;
  repoId: number;
}

const Chatbot: React.FC<ChatbotProps> = ({ userId, repoId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BACKEND_API_URL = "http://localhost:3001/api/chatbot/message";

  // 예시 질문들
  const exampleQuestions = [
    "Why was I matched with this repository?🤔",
    "What should I do first?\n Give me specific details about the action plan. 🚀",
    "What's the latest status and recent activity of this repository? 🆕",
  ];

  // 예시 질문 클릭 핸들러
  const handleExampleClick = async (question: string) => {
    setUserInput(question);

    // 바로 전송
    addMessage("user", question);
    setUserInput("");
    setIsTyping(true);

    let typingMessageId: number | null = null;
    try {
      typingMessageId = addMessage("bot", "Typing...");

      const body = { message: question, userId, rank: repoId };
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success === true && typeof data.response === "string") {
        updateMessage(typingMessageId, data.response);
      } else {
        console.warn("Backend response structure unexpected:", data);
        updateMessage(
          typingMessageId,
          "Sorry, the AI response was unexpected."
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (typingMessageId) {
        updateMessage(
          typingMessageId,
          "Oops! Something went wrong. Please try again."
        );
      } else {
        addMessage("bot", "Oops! Something went wrong. Please try again.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (sender: "user" | "bot", text: string): number => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      sender,
      text,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (messageId: number, newText: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, text: newText } : msg
      )
    );
  };

  const formatMessageText = (text: string) => {
    // HTML 태그 및 마크다운 굵게(**) 지원
    return text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  };

  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return; // Don't send empty messages

    addMessage("user", message); // Display user's message immediately
    setUserInput("");
    setIsTyping(true);

    let typingMessageId: number | null = null;
    try {
      typingMessageId = addMessage("bot", "Typing...");

      // --- props에서 가져온 userId, repoId 사용 ---
      const body = { message, userId, rank: repoId };
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // HTTP 상태 코드가 200번대가 아닐 경우
        const errorText = await response.text(); // 오류 응답 본문 확인
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${errorText}`
        );
      }

      const data = await response.json();

      // 받은 데이터가 예상하는 success: true, response: "..." 형태인지 확인
      if (data.success === true && typeof data.response === "string") {
        updateMessage(typingMessageId, data.response); // 실제 봇 응답으로 변경
      } else {
        // 백엔드가 200 OK를 보냈지만, JSON 내용이 예상과 다를 경우
        console.warn("Backend response structure unexpected:", data);
        updateMessage(
          typingMessageId,
          "Sorry, the AI response was unexpected."
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // `typingMessageId`가 이미 추가되었다면, 그 내용을 변경
      if (typingMessageId) {
        updateMessage(
          typingMessageId,
          "Oops! Something went wrong. Please try again."
        );
      } else {
        // `typingMessageId`가 추가되기 전에 오류가 났다면, 새 메시지 추가
        addMessage("bot", "Oops! Something went wrong. Please try again.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="bg-blue-light border border-white border-opacity-10 rounded-lg h-full flex flex-col">
      <div className="flex-1 p-4 border-b border-white border-opacity-10 overflow-y-auto">
        {messages.length === 0 ? (
          // 예시 질문들 표시
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                How can I help you contribute?
              </h3>
              <p className="text-gray-400 text-sm">
                Choose a question below or type your own
              </p>
            </div>
            <div className="space-y-3 w-full max-w-md">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  className="w-full p-3 text-left bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 rounded-lg text-gray-300 transition-all duration-200 hover:text-white"
                  dangerouslySetInnerHTML={{
                    __html: question.replace(/\n/g, "<br>"),
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // 기존 메시지들 표시
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                message.sender === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-white bg-opacity-10 text-gray-300 mr-auto"
              }`}
              dangerouslySetInnerHTML={{
                __html: formatMessageText(message.text),
              }}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3 p-4 flex-shrink-0">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 bg-black bg-opacity-20 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={isTyping}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
            isTyping
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
