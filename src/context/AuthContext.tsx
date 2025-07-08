
import type { sigInSchema } from '@/schemas/signInSchema';
import type { signUpSchema } from '@/schemas/signUpSchema';
import API from '@/service/Api/ApiFunctions/API';
import type { ApiResponse } from '@/service/Api/apiService';
import { jwtTokenManager } from '@/service/token/JwtTokenManager.class';
import type { sigInApiResponse, signUpApiResponse } from '@/types/Apis/auth';
import type { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useMemo, type FC } from 'react'


type AuthState =
    | { status: 'loading'; user: null }
    | { status: 'authenticated'; user: User }
    | { status: 'unauthenticated'; user: null };


type IAuthContext = {

    authState: AuthState,
    login: (data: sigInSchema) => Promise<ApiResponse<sigInApiResponse>>,
    register: (data: signUpSchema) => Promise<ApiResponse<signUpApiResponse>>,
    logout: () => void,
}


const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AUTH_QUERY_KEY = ['auth', 'user'] as const;


export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {





    const queryClient = useQueryClient();

    const { data: authData, isLoading } = useQuery<ApiResponse<User>>({
        queryKey: AUTH_QUERY_KEY,
        queryFn: API.fetchAuth.me,
        enabled: !!jwtTokenManager.getAccessToken(),
        // Remove initialData and select, handle mapping below
    });

    // Map the query result to AuthState
    const authState: AuthState = useMemo(() => {
        if (isLoading) {
            return { status: 'loading', user: null };
        }
        if (authData?.success && authData.data) {
            return { status: 'authenticated', user: authData.data };
        }
        return { status: 'unauthenticated', user: null };
    }, [isLoading, authData]);


    const signUpMutation = useMutation({
        mutationFn: API.fetchAuth.signUp,
        onSuccess: async (response) => {
            if (!response.success) return;
            jwtTokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
            await queryClient.setQueryData(AUTH_QUERY_KEY, response.data.user);
        }
    });


    const loginMuation = useMutation({
        mutationFn: API.fetchAuth.login,
        onSuccess: async (response) => {
            if (!response.success) return;
            jwtTokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
            await queryClient.setQueryData(AUTH_QUERY_KEY, response.data.user);
        }
    });




    const register = useCallback(async (data: signUpSchema) => {
        try {
            const response = await signUpMutation.mutateAsync(data);
            return response
        }
        catch (error) {
            return error as ApiResponse<signUpApiResponse>
        }
    }, [signUpMutation]);



    const login = useCallback(async (data: sigInSchema) => {
        try {
            const response = await loginMuation.mutateAsync(data);
            return response
        }
        catch (error) {
            return error as ApiResponse<sigInApiResponse>
        }

    }, [loginMuation]);


    const logout = useCallback(() => {
        jwtTokenManager.clearTokens();
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
    }, [queryClient]);


    const initializeAuth = useCallback(async () => {


        const refreshToken = jwtTokenManager.getRefreshToken();

        if (!refreshToken) {
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
            return
        };

        const tokens = await API.fetchAuth.refresh(refreshToken);

        if (tokens.success) {
            jwtTokenManager.setTokens(tokens.data.accessToken, tokens.data.refreshToken);
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });

        }
        else {
            jwtTokenManager.clearTokens();
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
        }



    }, [queryClient]);



    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);


    const contextValue = useMemo<IAuthContext>(() => ({
        authState,
        login,
        register,
        logout,
    }), [login, register, logout, authState]);



    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
};



export const useAuth = () => {

    const context = useContext(AuthContext);

    if (context === undefined)
        throw new Error('useAuth must be used within an AuthProvider');

    return context;
}

