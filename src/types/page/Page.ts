import type { Pageable } from './Pageable';

export type Page<T> = {
  content: T[];
  pagination: Pageable;
};
