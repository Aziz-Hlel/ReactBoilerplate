import { apiService } from '../Api/apiService';
import type { AxiosRequestConfig } from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { Pageable } from '@/types/page/Pageable';

interface UseApiOptions {
  url: string;
  queryParams?: Pageable;
  onError?: (error: unknown, query: unknown) => void;
  onSuccess?: (data: unknown) => void;
  queryKey: string[];
  options: {
    enabled?: boolean;
    staleData?: boolean;
    cacheData?: boolean;
    config?: AxiosRequestConfig & { params?: Pageable };
  };
}

const useApiQuery = <K>({ url, queryKey, options }: UseApiOptions) => {
  const fetch = () => apiService.getThrowable<K>(url, options.config);

  return useQuery({
    queryKey: queryKey,
    queryFn: fetch,
    enabled: options.enabled, // don't fetch automatically
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};

export default useApiQuery;
