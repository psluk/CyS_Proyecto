import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./index.css";
import "./config/firebase-config.js"; // Initialize Firebase, for login and analytics
import { SessionProvider } from "./context/SessionContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
