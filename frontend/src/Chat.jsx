import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]); // Stores conversation history
  const [input, setInput] = useState(""); // Current user input
  const [isLoading, setIsLoading] = useState(false); // Loading state for API requests

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Prepare conversation history for context-aware request
      const conversation = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      conversation.push({ role: "user", content: input }); // Add current user message

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }), // Send full conversation history
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Update messages with user input and assistant reply
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-user`, role: "user", content: input },
        { id: `${Date.now()}-assistant`, role: "assistant", content: data.reply },
      ]);
      setInput(""); // Clear input field
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
