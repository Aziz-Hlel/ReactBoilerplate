import userService from '@/Api/service/userService';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

const useGetTableData = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const queryParams = {
    ...params,
    page: params.page ? Number(params.page) - 1 : 0,
  };

  const { data } = useQuery({
    queryKey: ['users', searchParams.toString()],
    queryFn: async () => await userService.getUsers(queryParams),
  });

  const tableData = data?.success ? data?.data.content : [];
  const pagination = data?.success
    ? data?.data.pagination
    : { size: 0, number: 0, totalElements: 0, totalPages: 0, offset: 0, pageSize: 0 };

  return { tableData, pagination };
};

export default useGetTableData;
