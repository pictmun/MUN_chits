// src/components/ChitModalWrapper.tsx
import React from "react";
import { useParams } from "react-router-dom";
import ChitModal from "./ChitModal";
import { messages } from "./data/messages";

interface ChitModalWrapperProps {
  onClose: () => void;
}

const ChitModalWrapper: React.FC<ChitModalWrapperProps> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();

  if (!id || isNaN(Number(id))) {
    return <div>Invalid chit ID</div>;
  }

  const chitData = messages.find((message) => message.id === parseInt(id));

  if (!chitData) {
    return <div>Chit not found</div>;
  }

  return <ChitModal messages={messages} onClose={onClose} />;
};

export default ChitModalWrapper;
