// src/components/ChitModalWrapper.tsx
import React from "react";
import { useParams } from "react-router-dom";
import ChitModal from "./ChitModal";
import { useGetChit } from "./hooks/useGetChit";

interface ChitModalWrapperProps {
}

const ChitModalWrapper: React.FC<ChitModalWrapperProps> = () => {
  const { id } = useParams<{ id: string }>();
const {loading,chit}=useGetChit(id!)

 if(loading) return <div>Loading...</div>;
  if (!id ) {
    return <div>Invalid chit ID</div>;
  }



  if (!chit) {
    return <div>Chit not found</div>;
  }

  return <ChitModal messages={chit} />;
};

export default ChitModalWrapper;
