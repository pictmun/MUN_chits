import { useAuthContext } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/mode-toggle";
import { MobileNavbar } from "./MobileNavbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="size-12">
                    <AvatarFallback className="text-xl">
                      {authUser.portfolio.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{authUser?.portfolio}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ModeToggle />
            <MobileNavbar />
          </>
        )}
      </div>
    </div>
  );
};
