import type { ApiResponse } from "@/Api/ApiResponse";
import { authService } from "@/Api/service/authService";
import type { IauthService } from "@/Api/service/IauthService";
import { jwtTokenManager } from "@/Api/token/JwtTokenManager.class";
import type { SignInRequestDto } from "@/types/auth/SignInRequestDto";
import type { SignInResponseDto } from "@/types/auth/SignInResponseDto";
import type { SignUpResponseDto } from "@/types/auth/SignUpResponseDto";
import type { User } from "@/types/user/user";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { createContext, useMemo, useCallback, useContext } from "react";
import { getAuth } from "firebase/auth";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated"; user: null };

type IAuthContext = {
  authState: AuthState;
  user: User | null;
  signIn: IauthService["signIn"];
  signUp: IauthService["signUp"];
  logout: () => void;
};

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AUTH_QUERY_KEY = ["auth", "user"] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: authData, isLoading } = useQuery<ApiResponse<User>>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const accessToken = jwtTokenManager.getAccessToken();
      const refreshToken = jwtTokenManager.getRefreshToken();

      // No tokens at all - user is not authenticated
      if (!accessToken && !refreshToken) {
        throw new Error("No authentication tokens");
      }

      // Try to fetch user with access token
      if (accessToken) {
        try {
          const response = await authService.me();
          if (response.success) {
            return response;
          }
        } catch (error) {
          // Access token failed, will try refresh below
          console.warn("Access token invalid, attempting refresh");
        }
      }

      // Access token missing or invalid - try refresh token
      if (refreshToken) {
        const refreshResponse = await authService.refresh({
          refreshToken,
        });

        if (refreshResponse.success) {
          jwtTokenManager.setTokens(
            refreshResponse.data.accessToken,
            refreshResponse.data.refreshToken,
          );
          // Fetch user data with new token
          return await authService.me();
        }
      }

      // Both tokens failed
      jwtTokenManager.clearTokens();
      throw new Error("Authentication failed");
    },
    enabled:
      !!jwtTokenManager.getAccessToken() || !!jwtTokenManager.getRefreshToken(),
    retry: false, // Don't retry failed auth requests
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });

  const authState: AuthState = useMemo(() => {
    if (isLoading) {
      return { status: "loading", user: null };
    }
    if (authData?.success && authData.data) {
      return { status: "authenticated", user: authData.data };
    }
    return { status: "unauthenticated", user: null };
  }, [isLoading, authData]);

  const signUpMutation = useMutation({
    mutationFn: authService.signUp,
    onSuccess: async (response) => {
      if (!response.success) return;
      jwtTokenManager.setNewAccessToken();
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.signIn,
    onSuccess: (response) => {
      if (!response.success) return;
      jwtTokenManager.setTokens(
        response.data.accessToken,
        response.data.refreshToken,
      );
      queryClient.setQueryData(AUTH_QUERY_KEY, response);
    },
  });

  const register: IauthService["signUp"] = useCallback(
    async (data) => {
      try {
        return await signUpMutation.mutateAsync(data);
      } catch (error) {
        return error as ApiResponse<SignUpResponseDto>;
      }
    },
    [signUpMutation],
  );

  const login: IauthService["signIn"] = useCallback(
    async (data: SignInRequestDto) => {
      try {
        return await loginMutation.mutateAsync(data);
      } catch (error) {
        return error as ApiResponse<SignInResponseDto>;
      }
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    jwtTokenManager.clearTokens();
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
  }, [queryClient]);

  const contextValue = useMemo<IAuthContext>(
    () => ({
      authState,
      user: authState.user,
      signIn: login,
      signUp: register,
      logout,
    }),
    [login, register, logout, authState],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
