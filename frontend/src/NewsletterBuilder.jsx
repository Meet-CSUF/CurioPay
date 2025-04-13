import React, { useState } from "react";

const NewsletterBuilder = () => {
  const [budget, setBudget] = useState(1.0);
  const [newsletter, setNewsletter] = useState(null);

  const generateNewsletter = async () => {
    try {
      const response = await fetch("http://localhost:8000/generate-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setNewsletter(data);
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  return (
    <div className="newsletter-container">
      <h2>Build Your Newsletter</h2>

      {/* Budget Input */}
      <div className="budget-section">
        <label>Daily Budget ($):</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value))}
          min="0.10"
          step="0.10"
          placeholder="Enter budget"
        />
      </div>

      {/* Generate Button */}
      <button className="generate-button" onClick={generateNewsletter}>Generate Newsletter</button>

      {/* Newsletter Display */}
      {newsletter && (
        <div className="newsletter-display">
          <h3>Your AI-Powered Newsletter</h3>
          {newsletter.articles.map((article, index) => (
            <div key={index} className="article">
              <h4>{article.title}</h4>
              <p>Source: {article.source}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsletterBuilder;
