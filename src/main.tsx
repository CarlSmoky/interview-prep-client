import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureAuth } from "./lib/auth/config";

configureAuth();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);
