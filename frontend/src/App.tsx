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
import LogoutButton from "./components/LogoutButton";
import { Topbar } from "./components/Topbar";
import BoardModal from "./EBModal";
import BoardInbox from "./BoardInbox";

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
  const handleScoreSubmit = () => {};
// const handleSelectMessage = () => {};
  return (
    <Router>

      <div className="flex flex-col py-4  w-full">
      <Topbar/>

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
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route path="/eb-board" element={<BoardInbox messages={messages} onMessageSelect={handleSelectMessage}/>}/>
          <Route path="/eb/:id" element={<BoardModal messages={messages} onScoreSubmit={handleScoreSubmit}/>}/>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
