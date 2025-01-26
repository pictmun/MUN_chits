import { Button } from './ui/button'
import { useLogout } from '../hooks/useLogout'
import { cn } from '../lib/utils'

const LogoutButton = ({classList}:{classList?:string}) => {
   const {logout}= useLogout()

  return (
    <Button onClick={logout} className={cn(classList)}>Logout</Button>
  )
}

export default LogoutButton