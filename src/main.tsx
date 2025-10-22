import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { persistor, store } from "./store.ts";
import { DashboardDrawerProvider } from "./contexts/DrawerContext.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import LoadingSpinner from "./components/LoadingSpinner.tsx";

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!VITE_GOOGLE_CLIENT_ID) {
  throw new Error(
    "VITE_GOOGLE_CLIENT_ID is not defined! Check your .env or deployment settings."
  );
}

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner fullScreen={true} size={36}/>} persistor={persistor}>
        <ThemeProvider>
          <DashboardDrawerProvider>
            <App />
          </DashboardDrawerProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
);
