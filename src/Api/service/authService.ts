import { apiService } from "@/Api/apiService";
import apiRoutes from "../routes/routes";
import type { SignInResponseDto } from "@/types/auth/SignInResponseDto";
import type { IauthService } from "./IauthService";
import type { SignUpResponseDto } from "@/types/auth/SignUpResponseDto";

export const authService: IauthService = {
  signIn: (payload) => {
    return apiService.post<SignInResponseDto>(apiRoutes.auth.singIn(), payload);
  },
  signUp: (payload) => {
    return apiService.post<SignUpResponseDto>(apiRoutes.auth.signUp(), payload);
  },
  me: () => {
    return apiService.get(apiRoutes.auth.me());
  },
  refresh: (payload) => {
    return apiService.post(apiRoutes.auth.refresh(), payload);
  },
};
