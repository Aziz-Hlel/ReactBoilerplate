import { apiService } from "./apiService";

const apiMethods = {
    GET: apiService.get,
    POST: apiService.post,
    PUT: apiService.put,
    // PATCH: apiService.patch,
    DELETE: apiService.delete,
} as const;

export default apiMethods;