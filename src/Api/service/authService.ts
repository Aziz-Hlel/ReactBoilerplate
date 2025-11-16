import { apiService } from "@/Api/apiService";
import apiRoutes from "../routes";
import type { SignInRequestDto } from "@/types/auth/SignInRequestDto";
import type { SignInResponseDto } from "@/types/auth/SignInResponseDto";
import type { SignUpRequestDto } from "@/types/auth/SignUpRequestDto";
import type { IauthService } from "./IauthService";
import type { SignUpResponseDto } from "@/types/auth/SignUpResponseDto";
import type { RefreshRequestDto } from "@/types/auth/RefreshRequestDto";

export const authService: IauthService = {
  signIn: (payload: SignInRequestDto) => {
    return apiService.post<SignInResponseDto>(apiRoutes.auth.singIn(), payload);
  },
  signUp: (payload: SignUpRequestDto) => {
    return apiService.post<SignUpResponseDto>(apiRoutes.auth.signUp(), payload);
  },
  me: () => {
    return apiService.get(apiRoutes.auth.me());
  },
  refresh: (payload: RefreshRequestDto) => {
    return apiService.post(apiRoutes.auth.refresh(), payload);
  },
};
