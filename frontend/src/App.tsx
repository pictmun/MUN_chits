// src/components/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import ChitEntry from "./pages/delegates/ChitEntry";
import Inbox from "./pages/delegates/inbox";
import ChitModalWrapper from "./pages/delegates/ChitModalWrapper";
import Login from "./pages/auth/LoginPage";
import { Toaster } from "./components/ui/sonner";
import { useAuthContext } from "./context/AuthContext";
import { Topbar } from "./components/Topbar";
import BoardModal from "./pages/eb/EBModal";
import BoardInbox from "./pages/eb/BoardInbox";
import CreateEntries from "./pages/admin/CreateEntries";
import { Sidebar } from "./components/Sidebar";
import { Loading } from "./components/Loading";
import SentMessages from "./pages/delegates/SentMessages";

const App: React.FC = () => {
  const { isLoading, authUser } = useAuthContext();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col pb-4 w-full">
        <Topbar />
        <div className="flex">
          {authUser && <Sidebar />}
          <div className="w-full md:w-5/6">
            <Routes>
              <Route
                path="/eb-board"
                element={
                  authUser && authUser.role === "EB" ? (
                    <BoardInbox />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/eb/:id"
                element={
                  authUser && authUser.role === "EB" ? (
                    <BoardModal />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  authUser ? (
                    authUser.role === "EB" ? (
                      <Navigate to="/eb-board" />
                    ) : (
                      <Inbox />
                    )
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
                  authUser ? <ChitModalWrapper /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/create-user"
                element={
                  authUser && authUser.role === "ADMIN" ? (
                    <CreateEntries />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/login"
                element={!authUser ? <Login /> : <Navigate to="/" />}
              />
              <Route path="/sent-chits" element={!authUser ? <Login /> : <SentMessages />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default App;
