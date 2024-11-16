import { useAuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Link } from 'react-router-dom';


export const Topbar = () => {
    const {authUser}=useAuthContext();
  return (
    <div className="max-w-xl px-2 sm:px-0 w-full mx-auto flex items-center justify-between mb-4">
      <span>MUN</span>
      <div className="flex items-center gap-2">
        {authUser && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="font-bold rounded-full py-1 px-4 bg-gray-600/50 text-gray-600">
                  {authUser?.username}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='flex flex-col gap-3 py-2 px-3'>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/chit-entry" className='font-semibold text-lg'>Create A Chit</Link>
                </DropdownMenuItem>
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
