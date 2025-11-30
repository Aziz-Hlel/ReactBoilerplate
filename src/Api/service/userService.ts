import type { User } from "@/types/user/user";
import { apiService } from "../apiService";
import apiRoutes from "../routes/routes";

const userService = {
  getUsers: async (searchParams: URLSearchParams) =>
    apiService.getThrowable<{
      data: User[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(apiRoutes.users.getUsers(), {
      params: searchParams.toString(),
    }),
};

export default userService;
