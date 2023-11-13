type SearchResult<T> = {
  next_cursor: number | null;
  prev_cursor: number | null;
  recipe: T[]; //FIXME: make generic
};
