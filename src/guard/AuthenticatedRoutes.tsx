import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/utils/LoadingSpinner';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthenticatedRoutes = () => {
  const { authState } = useAuth();

  const navigate = useNavigate();

  if (authState.status === 'loading') return <LoadingSpinner />;

  if (authState.status === 'unauthenticated')
    return (
      <>
        {' '}
        <div className=" pr-5">Not logged in</div>{' '}
        <div className=" underline hover:cursor-pointer" onClick={() => navigate('/signin')}>
          go Home
        </div>{' '}
      </>
    );

  return <Outlet />;
};

export default AuthenticatedRoutes;
