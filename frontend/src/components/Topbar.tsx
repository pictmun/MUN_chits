import { useAuthContext } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/mode-toggle";
import { MobileNavbar } from "./MobileNavbar";

export const Topbar = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="px-6 py-2 border-b-2  w-full mx-auto flex items-center justify-between  ">
      <Link to="/" className="flex items-center">
        <img src="/logo.webp" alt="logo" className="w-12" />
      </Link>
      <div className="flex items-center gap-2">
        {authUser && (
          <>
            <Avatar className="size-12">
              <AvatarFallback className="text-xl">
                {authUser.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <ModeToggle />
            <MobileNavbar/>
          </>
        )}
      </div>
    </div>
  );
};
