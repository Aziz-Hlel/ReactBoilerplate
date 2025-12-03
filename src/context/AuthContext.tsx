import type { ApiErrorResponse, ApiResponse } from '@/types/api/ApiResponse';
import { authService, type IauthService } from '@/Api/service/authService';
import { jwtTokenManager } from '@/Api/token/JwtTokenManager.class';
import type { SignInResponseDto } from '@/types/auth/SignInResponseDto';
import type { User } from '@/types/user/user';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { createContext, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthState =
  | { status: 'loading'; user: null }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated'; user: null };

type IAuthContext = {
  authState: AuthState;
  user: User | null;
  signIn: IauthService['signIn'];
  signUp: IauthService['signUp'];
  oAuthSignIn: IauthService['oAuthSignIn'];
  logout: () => void;
};

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AUTH_QUERY_KEY = ['auth', 'user'] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const accessToken = await jwtTokenManager.getInitialAccessToken();

      if (!accessToken) {
        throw new Error('No authentication tokens');
      }

      const response = await authService.me();
      console.log('l response wtf ', response);
      if (response.success) {
        return response.data;
      }

      jwtTokenManager.clearTokens();

      throw new Error('Failed to fetch user data from backend');
    },
    retry: false,
    // staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });

  const authState: AuthState = useMemo(() => {
    if (isLoading) {
      return { status: 'loading', user: null };
    }
    if (currentUser) {
      return { status: 'authenticated', user: currentUser };
    }
    return { status: 'unauthenticated', user: null };
  }, [isLoading, currentUser]);

  const signUpMutation = useMutation({
    mutationFn: authService.signUp,
    onSuccess: async (response) => {
      if (!response.success) return;
      console.log('t5l l onsuccess');
      jwtTokenManager.setNewAccessToken();
      await queryClient.setQueryData(AUTH_QUERY_KEY, response.data);

      console.log('seta zok om l quey data');
    },
  });

  const signInMutation = useMutation({
    mutationFn: authService.signIn,
    onSuccess: (response) => {
      if (!response.success) return;
      jwtTokenManager.setNewAccessToken();

      queryClient.setQueryData(AUTH_QUERY_KEY, response.data);
    },
  });

  const oAuthSignInMutation = useMutation({
    mutationFn: authService.oAuthSignIn,
    onSuccess: (response) => {
      if (!response.success) return;
      jwtTokenManager.setNewAccessToken();

      queryClient.setQueryData(AUTH_QUERY_KEY, response.data);
    },
  });

  const oAuthSignIn: IauthService['oAuthSignIn'] = useCallback(
    async (data) => {
      try {
        return await oAuthSignInMutation.mutateAsync(data);
      } catch (error) {
        return error as ApiResponse<SignInResponseDto>;
      }
    },
    [oAuthSignInMutation],
  );

  const signUp: IauthService['signUp'] = useCallback(
    async (data) => {
      try {
        return await signUpMutation.mutateAsync(data);
      } catch (error) {
        return error as ApiErrorResponse;
      }
    },
    [signUpMutation],
  );

  const signIn: IauthService['signIn'] = useCallback(
    async (data) => {
      try {
        return await signInMutation.mutateAsync(data);
      } catch (error) {
        return error as ApiResponse<SignInResponseDto>;
      }
    },
    [signInMutation],
  );

  const logout = useCallback(() => {
    jwtTokenManager.clearTokens();
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    navigate('/signin');
  }, [queryClient, navigate]);

  const contextValue = useMemo<IAuthContext>(
    () => ({
      authState,
      user: authState.user,
      signIn,
      signUp,
      oAuthSignIn,
      logout,
    }),
    [signIn, signUp, oAuthSignIn, logout, authState],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
