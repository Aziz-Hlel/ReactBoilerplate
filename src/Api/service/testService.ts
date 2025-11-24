import { apiService } from "../apiService";
import apiRoutes from "../routes/routes";

const testService = {
  testConnection: async () =>
    apiService.getThrowable(apiRoutes.baseUrl() + "/"),
};
export default testService;
