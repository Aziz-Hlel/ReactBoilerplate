import type { SignInRequestDto } from "@/types/auth/SignInRequestDto";
import type { SignInResponseDto } from "@/types/auth/SignInResponseDto";
import type { ApiResponse } from "../ApiResponse";
import type { FirebaseSignUpRequestSchema } from "@/types/auth/SignUpRequestDto";
import type { SignUpResponseDto } from "@/types/auth/SignUpResponseDto";
import type { User } from "@/types/user/user";
import type { RefreshRequestDto } from "@/types/auth/RefreshRequestDto";

export interface IauthService {
  signIn: (
    payload: SignInRequestDto,
  ) => Promise<ApiResponse<SignInResponseDto>>;

  signUp: (
    payload: FirebaseSignUpRequestSchema,
  ) => Promise<ApiResponse<SignUpResponseDto>>;
  me: () => Promise<ApiResponse<User>>;
  refresh: (
    payload: RefreshRequestDto,
  ) => Promise<ApiResponse<SignInResponseDto>>;
}
