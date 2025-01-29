import { Mail, Menu, Send, Plus, ChartBarIncreasing } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import { useState } from "react";

export const MobileNavbar = () => {
  const sidebarLinks = [
    {
      name: "Inbox",
      path: "/",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Sent Chits",
      path: "/sent-chits",
      icon: <Send className="size-5" />,
    },
    {
      name: "Create a Chit",
      path: "/chit-entry",
      icon: <Plus className="size-5" />,
    },
    {
      name: "Inbox",
      path: "/eb-board",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Chit Marks",
      icon: <ChartBarIncreasing className="size-5" />,
      path: "/marks",
    },
    {
      name: "CreateUser",
      path: "/create-user",
      icon: <Plus className="size-5" />,
    },
  ];
  const { authUser } = useAuthContext();
  const url = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden" asChild>
        <Button variant={"outline"} size={"icon"} className="size-8">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="sr-only">
          <SheetTitle>Are you absolutely sure?</SheetTitle>
        </SheetHeader>

        <SheetDescription className="py-8 h-screen">
          <ul className="flex flex-col items-start gap-5">
            {authUser?.role == "DELEGATE" &&
              sidebarLinks.slice(0, 3).map((link, index) => (
                <li
                  key={index}
                  className={`${
                    url === link.path ? "bg-muted font-semibold" : ""
                  } text-lg  text-primary p-3 rounded-lg w-full`}
                >
                  <Link
                    onClick={() => setIsOpen(false)}
                    to={link.path}
                    className="flex items-center justify-start gap-2"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            {authUser?.role == "EB" &&
              sidebarLinks.slice(3, 5).map((link, index) => (
                <li
                  key={index}
                  className={`${
                    url === link.path ? "bg-muted font-semibold" : ""
                  } text-lg  text-primary p-3 rounded-lg w-full`}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-start gap-2"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            {authUser?.role == "ADMIN" && (
              <li
                className={`${
                  url === "/create-user" ? "bg-muted font-semibold" : ""
                } text-lg  text-primary p-3 rounded-lg w-full`}
              >
                <Link
                  to="/create-user"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-start gap-2"
                >
                  <Plus className="size-5" />
                  Create User
                </Link>
              </li>
            )}
          </ul>
          <div className="mt-56 flex flex-col gap-3">
            <div className="flex items-center justify-start w-full bg-muted py-1 px-2 rounded-full gap-2">
              <div className="size-10 flex items-center justify-center fonr-bold text-2xl bg-slate-200 dark:bg-slate-800 rounded-full">
                {authUser?.portfolio.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-0">
                <p className="font-semibold text-lg">
                  {authUser?.portfolio && authUser?.portfolio.length > 10
                    ? authUser?.portfolio.substring(0, 20) + "..."
                    : authUser?.portfolio}
                </p>
                <p className="text-sm text-muted-foreground uppercase">
                  {authUser?.committee}
                </p>
              </div>
            </div>
            <LogoutButton classList="w-full" />
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};
