import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import ChitEntry from './ChitEntry';
import Inbox from './inbox';
import ChitModal from './ChitModal';

type Message = {
  id: number;
  sender: string;
  subject: string;
  timestamp: string;
  message: string;
  sendViaEB: boolean;
  isUnread: boolean;
};

const messages: Message[] = [
  { id: 1, sender: "America", subject: "Global Invasion", message: "Keep My country's name off yo mouth!!!", timestamp: "10:30 AM", isUnread: true, sendViaEB: true },
  { id: 2, sender: "Japan", subject: "Watch some anime dude", message: "Anime is culture, embrace it!", timestamp: "9:00 AM", isUnread: false, sendViaEB: false },
];

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
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Inbox messages={messages} onMessageSelect={handleSelectMessage} />}
          />
          <Route
            path="/chit-entry"
            element={<ChitEntry onSubmit={(chit) => console.log(chit)} />}
          />
          <Route
            path="/chit/:id"
            element={<ChitModalWrapper onClose={handleCloseModal} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

interface ChitModalWrapperProps {
  onClose: () => void;
}

const ChitModalWrapper: React.FC<ChitModalWrapperProps> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();

  // Ensure we handle the case where `id` might be undefined or invalid
  const chitData = messages.find((message) => message.id === parseInt(id!));

  if (!chitData) {
    // If no chit found, show an error or fallback UI
    return <div>Chit not found</div>;
  }

  // Return the ChitModal with valid chit data
  return <ChitModal chit={chitData} onClose={onClose} />;
};

export default App;
