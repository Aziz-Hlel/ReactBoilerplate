import type { User } from "../user";

// Utility type to flatten/intersect types
type Prettify<T> = { [K in keyof T]: T[K] };

type loginAndResigterApiResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export type signUpApiResponse = Prettify<loginAndResigterApiResponse>;

export type sigInApiResponse = Prettify<loginAndResigterApiResponse>;