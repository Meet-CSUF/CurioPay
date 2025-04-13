import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { 
          id: `${Date.now()}-user`, 
          role: "user", 
          content: input 
        },
        { 
          id: `${Date.now()}-assistant`, 
          role: "assistant", 
          content: data.reply 
        },
      ]);
      setInput("");
    } catch (error) {
      console.error("API Request Failed:", error);
      alert(`Message send failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Interface</h2>

      {/* Messages Section */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          aria-label="Type your message"
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="loading-indicator">Sending...</span>
          ) : (
            <span>Send</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
