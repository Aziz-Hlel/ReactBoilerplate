import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';

const testService = {
  testConnection: async () => apiService.getThrowable(apiRoutes.health()),
};
export default testService;
