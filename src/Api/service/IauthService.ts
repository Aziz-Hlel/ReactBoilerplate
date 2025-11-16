import type { SignInRequestDto } from "@/types/auth/SignInRequestDto";
import type { SignInResponseDto } from "@/types/auth/SignInResponseDto";
import type { ApiResponse } from "../ApiResponse";
import type { SignUpRequestDto } from "@/types/auth/SignUpRequestDto";
import type { SignUpResponseDto } from "@/types/auth/SignUpResponseDto";
import type { User } from "@/types/user/user";
import type { RefreshRequestDto } from "@/types/auth/RefreshRequestDto";

export type ISignIn = (
  payload: SignInRequestDto
) => Promise<ApiResponse<SignInResponseDto>>;

export type ISignUp = (
  payload: SignUpRequestDto
) => Promise<ApiResponse<SignUpResponseDto>>;

export type IMe = () => Promise<ApiResponse<User>>;

export type IRefresh = (
  payload: RefreshRequestDto
) => Promise<ApiResponse<SignInResponseDto>>;

export interface IauthService {
  signIn: ISignIn;
  signUp: ISignUp;
  me: IMe;
  refresh: IRefresh;
}
