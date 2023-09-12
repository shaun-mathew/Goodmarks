import { Injectable, Req } from '@nestjs/common';
import { VecDbService } from '../vec-db/vec-db.service';
import {
  FilterOperator,
  Operator,
  VecField,
} from '../bookmark/interface/bookmark.interface';
import { SearchQuery } from './dto/query-search.dto';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { SearchResult } from 'src/vec-db/vec-db-weaviate/vec-db-weaviate.service';
import { UserService } from 'src/user/user.service';
import User from 'src/user/user.entity';

@Injectable()
export class SearchService {
  constructor(
    private vecDb: VecDbService,
    private bookmarkService: BookmarkService,
    private userService: UserService,
  ) {}
  async query(
    user: User,
    { query, ...rest }: SearchQuery,
  ): Promise<SearchResult[]> {
    let operations: FilterOperator[] = [];

    if (rest.dateStart) {
      const operation: FilterOperator = {
        field: VecField.Date,
        operator: Operator.GreaterThanEqual,
        value: rest.dateStart.toString(),
      };

      operations.push(operation);
    }

    if (rest.dateEnd) {
      const operation: FilterOperator = {
        field: VecField.Date,
        operator: Operator.LessThanEqual,
        value: rest.dateEnd.toString(),
      };

      operations.push(operation);
    }

    if (rest.url) {
      const operation: FilterOperator = {
        field: VecField.Url,
        operator: Operator.Like,
        value: rest.url,
      };

      operations.push(operation);
    }
    const res = await this.vecDb.findBookmark({
      query,
      operations,
      userID: user.id,
    });

    const transformedRes = (
      await Promise.all(
        res.map(async (item) => {
          try {
            const bookmark = await this.bookmarkService.getBookmark(
              user,
              item.bookmarkID,
            );
            return {
              ...bookmark,
              ...item,
            };
          } catch (error) {
            return null;
          }
        }),
      )
    ).filter((item) => item !== null);

    return transformedRes ?? [];
  }
}
