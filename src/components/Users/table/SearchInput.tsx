import { useEffect, useId, useState } from 'react';
// import { useDebounce } from '@uidotdev/usehooks';

import { LoaderCircleIcon, SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import type { Table } from '@tanstack/react-table';
import type { User } from '@/types/user/user';

const SearchInput = ({ table }: { table: Table<User> }) => {
  const value = (table.getColumn('email')?.getFilterValue() as string) ?? '';
  const [isLoading, setIsLoading] = useState(false);
//   const debouncedValue = useDebounce<string>(value, 300);

  const id = useId();

  useEffect(() => {
    if (value) {
      setIsLoading(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    setIsLoading(false);
  }, [table, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn('email')?.setFilterValue(value);
  };

  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <SearchIcon className="size-4" />
          <span className="sr-only">Search</span>
        </div>
        <Input
          id={id}
          type="search"
          placeholder="Search..."
          value={value}
          onChange={handleChange}
          className="peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
        />
        {isLoading && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
            <LoaderCircleIcon className="size-4 animate-spin" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
