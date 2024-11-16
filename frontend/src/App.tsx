// src/components/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChitEntry from "./ChitEntry";
import Inbox from "./inbox";
import ChitModalWrapper from "./ChitModalWrapper";
import Login from "./LoginPage";
import { Toaster } from "./components/ui/sonner";
import { useAuthContext } from "./context/AuthContext";
import { Topbar } from "./components/Topbar";
import BoardModal from "./EBModal";
import BoardInbox from "./BoardInbox";
import CreateEntries from "./pages/CreateEntries";

const App: React.FC = () => {
  const { isLoading, authUser } = useAuthContext();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>

      <div className="flex flex-col py-4  w-full">
      <Topbar/>

        <Routes>
            <Route path="/eb-board" element={authUser && authUser.role === "EB" ? <BoardInbox />: <Navigate to="/login"/>}/>
            <Route path="/eb/:id" element={authUser && authUser.role === "EB" ? <BoardModal/>: <Navigate to="/login"/>}/>
          <Route
            path="/"
            element={
              authUser ? (authUser.role === "EB" ? <Navigate to="/eb-board" />:<Inbox/>
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
                <ChitModalWrapper  />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/create-user" element={authUser&& authUser.role === "ADMIN" ? <CreateEntries />: <Navigate to="/login"/>}/>
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
