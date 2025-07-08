import type { User } from "@/types/user";

export type SignUpApiResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}
