import type { User } from '@/types/user/user';
import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { Page } from '@/types/page/Page';

const userService = {
  getUsers: async (searchParams: { [k: string]: string | number }) =>
    apiService.getThrowable<Page<User>>(apiRoutes.users.getUsers(), {
      params: searchParams,
    }),
};

export default userService;
