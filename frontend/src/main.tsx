import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// Commented out the socket context and auth context as the frontend is not yet wired up to the backend
// import { AuthContextProvider } from "./context/AuthContext.tsx";
// import SocketContextProvider from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <SocketContextProvider> */}
    {/* <AuthContextProvider> */}
    <App />
    {/* </AuthContextProvider> */}
    {/* </SocketContextProvider> */}
  </StrictMode>
);
