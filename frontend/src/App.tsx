// src/components/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChitEntry from "./ChitEntry";
import Inbox from "./inbox";
import ChitModalWrapper from "./ChitModalWrapper";
import { messages, Message } from "./data/messages";
import Login from "./LoginPage";
import { Toaster } from "./components/ui/sonner";

const App: React.FC = () => {
  const [selectedChit, setSelectedChit] = useState<Message | null>(null);

  const handleSelectMessage = (message: Message) => {
    setSelectedChit(message);
  };

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
              <Inbox
                messages={messages}
                onMessageSelect={handleSelectMessage}
              />
            }
          />
          <Route
            path="/chit-entry"
            element={<ChitEntry onSubmit={(chit) => console.log(chit)} />}
          />
          <Route
            path="/chit/:id"
            element={<ChitModalWrapper onClose={handleCloseModal} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
