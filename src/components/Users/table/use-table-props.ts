import type { ColumnFiltersState, SortingState, Updater, VisibilityState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useTableProps = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection] = useState({});

  const onSortingChange = (updater: Updater<SortingState>) => {
    const newSortingState = typeof updater === 'function' ? updater(sorting) : updater;

    const sortField = newSortingState[0]?.id ?? 'createdAt';
    const sortOrder = newSortingState[0]?.desc ? 'desc' : 'asc';

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('sort', sortField);
      params.set('order', sortOrder);
      return params;
    });
  };

  const sorting = useMemo(() => {
    if (searchParams.get('sort') && searchParams.get('order')) {
      return [
        {
          id: searchParams.get('sort') as string,
          desc: searchParams.get('order') === 'desc',
        },
      ];
    }
    return [];
  }, [searchParams]);

  const columnFilters = useMemo(() => {
    const searchValue = searchParams.get('search');
    if (searchValue !== '') {
      return [
        {
          id: 'email',
          value: searchValue,
        },
      ];
    }
    return [];
  }, [searchParams]);

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const newColumnFiltersState = typeof updater === 'function' ? updater(columnFilters) : updater;
    const searchValue = (newColumnFiltersState[0]?.value as string) ?? '';

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      searchValue !== '' ? params.set('search', searchValue) : params.delete('search');
      return params;
    });
  };

  const pageSize = useMemo(() => {
    const size = Number(searchParams.get('size'));

    console.log('l page size mn rab l usememo', size);
    if (size < 5) {
      searchParams.set('size', '5');
      return 5;
    }
    return size;
  }, [searchParams]);

  const pageNumber = useMemo(() => {
    const pageNumber = Number(searchParams.get('page'));
    if (pageNumber < 1) {
      searchParams.set('page', '1');
      return 1;
    }
    return pageNumber;
  }, [searchParams]);

  const changePage = (direc: 'next' | 'prev' | number) => {
    if (pageNumber === 1 && direc === 'prev') return;
    // if (pageIndex === pagination.totalPages && direc === 'next') return;
    // let newPage: number = pagination.number;
    // if (direc === 'next') newPage = pagination.number + 1;
    // if (direc === 'prev') newPage = pagination.number - 1;
    let newPage: number = pageNumber;
    if (typeof direc === 'number') newPage = direc;
    if (direc === 'next') newPage = pageNumber + 1;
    if (direc === 'prev') newPage = pageNumber - 1;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', String(newPage));
      return params;
    });
  };

  const onPageSizeChange = (size: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('size', String(size));
      params.set('page', '1');
      return params;
    });
  };

  return {
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    pageSize,
    pageIndex: pageNumber,
    changePage,
    onPageSizeChange,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
  };
};

export default useTableProps;
