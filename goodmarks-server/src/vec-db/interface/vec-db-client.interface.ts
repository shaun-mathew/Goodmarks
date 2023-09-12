import {
  CreateBookmarkInterface,
  DeleteBookmarkInterface,
  QueryBookmarkInterface,
  UpdateBookmarkInterface,
} from '../../bookmark/interface/bookmark.interface';

import { SearchResult } from '../vec-db-weaviate/vec-db-weaviate.service';

export interface VecDbClient {
  addBookmark(bookmark: CreateBookmarkInterface): Promise<any>;
  deleteBookmark(bookmark: DeleteBookmarkInterface): void;
  findBookmark(bookmark: QueryBookmarkInterface): Promise<SearchResult[]>;
  updateBookmark(bookmark: UpdateBookmarkInterface): void;
  purge(): void;
}
