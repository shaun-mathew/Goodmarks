import { Injectable, Inject } from '@nestjs/common';
import { CLIENT } from './constants';
import {
  CreateBookmarkInterface,
  UpdateBookmarkInterface,
  DeleteBookmarkInterface,
  QueryBookmarkInterface,
} from '../bookmark/interface/bookmark.interface';

import { VecDbClient } from './interface/vec-db-client.interface';
import { SearchResult } from './vec-db-weaviate/vec-db-weaviate.service';

@Injectable()
export class VecDbService {
  constructor(@Inject(CLIENT) private client: VecDbClient) {}

  async addBookmark(bookmark: CreateBookmarkInterface): Promise<void> {
    return this.client.addBookmark(bookmark);
  }

  async deleteBookmark(bookmark: DeleteBookmarkInterface): Promise<void> {
    this.client.deleteBookmark(bookmark);
  }

  async findBookmark(
    bookmark: QueryBookmarkInterface,
  ): Promise<SearchResult[]> {
    return this.client.findBookmark(bookmark);
  }

  async updateBookmark(bookmark: UpdateBookmarkInterface): Promise<void> {
    this.client.updateBookmark(bookmark);
  }
  async purge(): Promise<void> {
    this.client.purge();
  }
}
