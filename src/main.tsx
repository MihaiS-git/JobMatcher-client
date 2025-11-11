import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { persistor, store } from "./store.ts";
import { DashboardDrawerProvider } from "./contexts/DrawerContext.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import { HeadProvider } from "react-head";

// Import React Scan (only in dev mode)
/* if (import.meta.env.DEV) {
  import("react-scan").then(({ scan }) => {
    scan({
      enabled: true, // optional
      log: true, // will log renders
      showToolbar: true, // show the toolbar UI
      animationSpeed: "fast", // one of "slow" | "fast" | "off"
      trackUnnecessaryRenders: true, // flag to track unnecessary renders
      dangerouslyForceRunInProduction: false, // default
      onRender: (fiber, renders) => {
        console.log("Rendered:", fiber.type?.name, renders);
      },
      onPaintFinish: (outlines) => {
        console.log("Painted outlines:", outlines);
      },
    });
  });
} */

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!VITE_GOOGLE_CLIENT_ID) {
  throw new Error(
    "VITE_GOOGLE_CLIENT_ID is not defined! Check your .env or deployment settings."
  );
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate
      loading={<LoadingSpinner fullScreen={true} size={36} />}
      persistor={persistor}
    >
      <HeadProvider>
        <ThemeProvider>
          <DashboardDrawerProvider>
            <App />
          </DashboardDrawerProvider>
        </ThemeProvider>
      </HeadProvider>
    </PersistGate>
  </Provider>
);
