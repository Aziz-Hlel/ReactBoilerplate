import { createContext, useState, useEffect, useContext } from "react";
import apiGateway from "../service/Api/apiGateway";
import { apiService, type ApiResponse } from "../service/Api/apiService";
import type { signUpSchema } from "../schemas/signUpSchema";
import type { sigInSchema } from "../schemas/signInSchema";
import { jwtTokenManager } from "../service/token/JwtTokenManager.class";
import type { sigInApiResponse, signUpApiResponse } from "../types/Apis/auth";
import type { User } from "../types/user";




type IAuthContext = {
    user: User | null | undefined;
    signup: (data: signUpSchema) => Promise<ApiResponse<signUpApiResponse>>;
    login: (data: sigInSchema) => Promise<ApiResponse<sigInApiResponse>>;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {



    const [user, setUser] = useState<User | null | undefined>(undefined);


    const getCurrentUser = async () => {
        const response = await apiService.get<User>(apiGateway.user.me);
        return response
    };


    const whoAmI = async () => {

        const response = await getCurrentUser();
        response.success ? setUser(response.data) : setUser(null);

    }


    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Load tokens from localStorage
                jwtTokenManager.loadTokensFromStorage();

                if (!jwtTokenManager.refreshTokenExist()) setUser(null)
                else {
                    // Try to get user profile to verify token is still valid
                    const refreshToken = jwtTokenManager.getRefreshToken();


                    const response = await apiService.post<{ accessToken: string, refreshToken: string }>(apiGateway.user.refresh, { refreshToken });

                    if (response.success) {
                        jwtTokenManager.setTokens(response.data.accessToken, response.data.refreshToken);

                        const userResponse = await getCurrentUser();

                        userResponse.success ? setUser(userResponse.data) : setUser(null);

                    } else {
                        // Token invalid, clear it
                        setUser(null);
                        jwtTokenManager.clearTokens();
                    }
                }


            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
                jwtTokenManager.clearTokens();
            }
        };

        initializeAuth();
    }, []);



    const signup = async (data: signUpSchema) => {
        // const response = await Http.post(apiGateway.user.signUp, data);
        const response = await apiService.post<signUpApiResponse>(apiGateway.user.signUp, data);

        if (response.success) {
            const { accessToken, refreshToken, user } = response.data
            jwtTokenManager.setTokens(accessToken, refreshToken);
            setUser(user)
        }

        else setUser(null);
        return response

    }

    const login = async (data: sigInSchema) => {


        // const response = await Http.post(apiGateway.user.sigIn, data)
        const response = await apiService.post<sigInApiResponse>(apiGateway.user.sigIn, data);

        if (response.success) {
            const { accessToken, refreshToken, user } = response.data
            jwtTokenManager.setTokens(accessToken, refreshToken);

            setUser(user)

        }


        return response
    };

    const logout = async () => {

        setUser(null);
        jwtTokenManager.clearTokens();

    };

    const contextValue: IAuthContext = {
        user,
        signup,
        login,
        logout,
        refreshUser: whoAmI,
    };
    // console.log("user", user);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}