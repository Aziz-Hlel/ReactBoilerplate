import type { User } from "@/types/user/user";
import { apiService } from "../apiService";
import apiRoutes from "../routes/routes";

const userService = {
  getUsers: async (searchParams: URLSearchParams) =>
    apiService.getThrowable<{
      content: User[];
      pagination: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
      };
    }>(apiRoutes.users.getUsers(), {
      params: searchParams,
    }),
};

export default userService;
