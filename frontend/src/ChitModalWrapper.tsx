// src/components/ChitModalWrapper.tsx
import React from "react";
import { useParams } from "react-router-dom";
import ChitModal from "./ChitModal";
import { useGetChit } from "./hooks/useGetChit";

interface ChitModalWrapperProps {
  onClose: () => void;
}

const ChitModalWrapper: React.FC<ChitModalWrapperProps> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
const {loading,chit}=useGetChit(id!)


  if (!id ) {
    return <div>Invalid chit ID</div>;
  }



  if (!chit) {
    return <div>Chit not found</div>;
  }

  return <ChitModal messages={chit} onClose={onClose} />;
};

export default ChitModalWrapper;
