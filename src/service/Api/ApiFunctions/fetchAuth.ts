import type { sigInSchema } from "@/schemas/signInSchema";
import apiGateway from "../apiGateway";
import { apiService, type ApiResponse } from "../apiService";
import type { sigInApiResponse, signUpApiResponse } from "@/types/Apis/auth";
import type { signUpSchema } from "@/schemas/signUpSchema";
import type { User } from "@/types/user";


const fetchAuth = {

    login: (data: sigInSchema) => apiService.postThrowable<sigInApiResponse>(apiGateway.auth.login(), data),

    signUp: (data: signUpSchema) => apiService.postThrowable<signUpApiResponse>(apiGateway.auth.signUp(), data),

    me: () => apiService.get<User>(apiGateway.auth.me()),

    refresh: (refreshToken: string) => apiService.post<{ accessToken: string, refreshToken: string }>(apiGateway.auth.refresh(), { refreshToken }),


} as const;

export default fetchAuth;