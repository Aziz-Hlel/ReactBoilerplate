import type { User } from "../user";


export type signUpApiResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export type sigInApiResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}