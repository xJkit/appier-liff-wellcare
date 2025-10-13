import { useLineUserProfile } from './services/hooks'
import { Outlet } from 'react-router-dom'

function Root() {
  const { isLoading } = useLineUserProfile()
  if (isLoading) return null;
  return <Outlet />
}

export default Root
