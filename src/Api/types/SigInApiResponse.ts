import type { User } from "../../types/user";

export type SigInApiResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}