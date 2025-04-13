import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource/inter"; // Font for styling
import "./theme.css"; // Custom theme styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
