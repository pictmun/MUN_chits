import { Button } from './ui/button'
import { useLogout } from '../hooks/useLogout'

const LogoutButton = () => {
   const {logout}= useLogout()

  return (
    <Button onClick={logout} className=''>Logout</Button>
  )
}

export default LogoutButton