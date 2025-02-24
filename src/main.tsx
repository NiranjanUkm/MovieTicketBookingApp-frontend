import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { useEffect } from "react"; // Added missing import

const RootWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return <>{children}</>;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap');
      `}
    </style>
    <MantineProvider>
      <Notifications />
      <ModalsProvider>
        <ThemeProvider>
          <BrowserRouter>
            <RootWrapper>
              <App />
            </RootWrapper>
          </BrowserRouter>
        </ThemeProvider>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>
);