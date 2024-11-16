import { useAuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Link } from 'react-router-dom';


export const Topbar = () => {
    const {authUser}=useAuthContext();
  return (
    <div className="max-w-xl px-2 sm:px-0 w-full mx-auto flex items-center justify-between mb-4">
      <Link to="/">
        <img src="/logo.webp" alt="logo" className='w-16' />
      </Link>
      <div className="flex items-center gap-2">
        {authUser && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="cursor-pointer flex items-center font-bold rounded-full p-3 bg-gray-600/50 text-gray-600"
              >
                  {authUser?.username.charAt(0).toLocaleUpperCase()}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-3 py-2 px-3">
                {authUser&&(
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <div className='flex flex-col gap-1'>
                      <p className="font-semibold text-lg">{authUser.username}</p>
                      <p className="text-sm text-gray-500">{authUser.committee}-{authUser.role}</p>
                    </div>
                  </DropdownMenuItem>

                )}
                <DropdownMenuSeparator/>
                {authUser.role === "DELEGATE" && (
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/chit-entry" className="font-semibold text-lg">
                      Create A Chit
                    </Link>
                  </DropdownMenuItem>
                )}
                {authUser.role==="ADMIN"&&(
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/create-user" className="font-semibold text-lg">
                      Create User
                    </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
}
