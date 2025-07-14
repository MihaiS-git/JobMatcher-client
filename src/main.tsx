import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if(!VITE_GOOGLE_CLIENT_ID){
  throw new Error(
    "VITE_GOOGLE_CLIENT_ID is not defined! Check your .env or deployment settings."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
  </StrictMode>
);
