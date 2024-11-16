// src/components/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChitEntry from "./ChitEntry";
import Inbox from "./inbox";
import ChitModalWrapper from "./ChitModalWrapper";
import { messages, Message } from "./data/messages";
import Login from "./LoginPage";
import { Toaster } from "./components/ui/sonner";
import { useAuthContext } from "./context/AuthContext";

const App: React.FC = () => {
  const [selectedChit, setSelectedChit] = useState<Message | null>(null);
  const { isLoading, authUser } = useAuthContext();
  const handleSelectMessage = (message: Message) => {
    setSelectedChit(message);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleCloseModal = () => {
    setSelectedChit(null);
  };

  return (
    <Router>
      <div className="flex items-center justify-center h-screen w-full">
        <Routes>
          <Route
            path="/"
            element={
              authUser ? (
                <Inbox
                  messages={messages}
                  onMessageSelect={handleSelectMessage}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chit-entry"
            element={authUser ? <ChitEntry /> : <Navigate to="/login" />}
          />
          <Route
            path="/chit/:id"
            element={
              authUser ? (
                <ChitModalWrapper onClose={handleCloseModal} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !authUser ? (
                <Login />
              ) : (
                <Navigate to="/"
                />
              )
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
