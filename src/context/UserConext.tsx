import type { User } from '@/types/user/user';
import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Outlet } from 'react-router-dom';

const UserSessionContext = createContext<User | undefined>(undefined);

export function UserSessionProvider() {
  const { user } = useAuth();

  if (!user) return <> User still not defined when passed through UserProvider Context </>;

  return (
    <UserSessionContext.Provider value={user}>
      <Outlet />
    </UserSessionContext.Provider>
  );
}

export const useUser = (): User => {
  const user = useContext(UserSessionContext);

  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return user;
};
