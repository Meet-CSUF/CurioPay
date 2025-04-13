import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import NewsletterBuilder from "./NewsletterBuilder";
import Chat from "./Chat";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <img src="/logo.svg" alt="Logo" className="logo" />
          <h1>CurioPay: AI Newsletter Builder</h1>
        </header>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-button">Newsletter Builder</Link>
          <Link to="/chat" className="nav-button">Chat Interface</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<NewsletterBuilder />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
