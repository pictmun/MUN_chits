import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { ChartBarIncreasing, Mail, Plus, Send } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export const Sidebar = () => {
  const sidebarLinks = [
    {
      name: "Inbox",
      path: "/",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Sent Chits",
      path: "/sent-chits",
      icon: <Send />,
    },
    {
      name: "Create a Chit",
      path: "/chit-entry",
      icon: <Plus />,
    },
    {
      name: "Inbox",
      path: "/eb-board",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Chit Marks",
      path: "/marks",
      icon: <ChartBarIncreasing className="size-5" />,
    },
  ];
  const { authUser } = useAuthContext();
  const url = useLocation().pathname;
  return (
    <div className="hidden sticky left-0 top-0 md:flex flex-col w-1/6 p-4 border-r h-[calc(100vh-40px)] max-h-[calc(100vh-40px)] ">
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
              className="flex items-center justify-start gap-2"
            >
              <Plus className="size-5" />
              Create User
            </Link>
          </li>
        )}
      </ul>
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-start w-full bg-muted py-1 px-2 rounded-full gap-2">
          <div className="size-10 flex items-center justify-center fonr-bold text-2xl bg-slate-200 dark:bg-slate-800 rounded-full">
            {authUser?.portfolio.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0">
            <p className="font-semibold text-lg">
              {authUser?.portfolio && authUser?.portfolio?.length > 10
                ? authUser?.portfolio.substring(0, 10) + "..."
                : authUser?.portfolio}
            </p>
            <p className="text-sm text-muted-foreground uppercase">
              {authUser?.committee}
            </p>
          </div>
        </div>
        <LogoutButton classList="w-full" />
      </div>
    </div>
  );
};
