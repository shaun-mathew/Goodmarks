import { Injectable } from '@nestjs/common';
import {
  CreateBookmarkInterface,
  DeleteBookmarkInterface,
  QueryBookmarkInterface,
  UpdateBookmarkInterface,
  Bookmark,
  FilterOperator,
} from '../../bookmark/interface/bookmark.interface';
import { VecDbClient } from '../interface/vec-db-client.interface';
import { WeaviateService } from '../../weaviate';
import { WeaviateClient, WhereFilter } from 'weaviate-ts-client';

//TODO:Add user accounts

const MAX_LENGTH = 1000;
type TextChunk = {
  class: string;
  properties: {
    [key: string]: any;
  };
};

export type SearchResult = {
  bookmarkID: string;
  content: string;
  certainty: number;
};

@Injectable()
export class VecDbWeaviateService implements VecDbClient {
  public client: WeaviateClient;

  constructor(private weaviate: WeaviateService) {
    this.client = this.weaviate.client;
  }

  private contextualSplit(
    key: string,
    bookmark: Bookmark,
    chunkLength: number = 100,
    chunkOverlap: number = 20,
    class_str: string = 'Bookmark',
  ): TextChunk[] {
    /*
     * Given text, split paragraph into chunks of size chunkLength and chunk overlap
     */

    const { url, date, tags, bookmarkID, userID } = bookmark;
    const strArray = bookmark[key].split(/\s+/);
    let chunks: TextChunk[] = [];

    for (let i = 0; i < strArray.length; i += chunkLength) {
      let start = i - chunkOverlap < 0 ? i : i - chunkOverlap;
      let end = Math.min(i + chunkLength, strArray.length);

      const mergedStr = strArray.slice(start, end).join(' ');
      let chunk: TextChunk = {
        class: class_str,
        properties: {
          [key]: mergedStr,
          url,
          date,
          tags,
          bookmarkID,
          userID,
        },
      };

      chunks.push(chunk);

      if (chunks.length >= MAX_LENGTH) {
        break;
      }
    }

    return chunks;
  }

  //Separating properties for weighted search score in the future
  async addBookmark(bookmark: CreateBookmarkInterface) {
    const textKeys = [
      'content',
      'description',
      'userDescription',
      'title',
      'summary',
    ];
    let status = [];
    for (const key of textKeys) {
      if (bookmark[key]) {
        const keyChunks = this.contextualSplit(key, bookmark);
        status.push(
          this.client.batch
            .objectsBatcher()
            .withObjects(...keyChunks)
            .do(),
        );
      }
    }

    return Promise.all(status);
  }
  async deleteBookmark({ bookmarkID }: DeleteBookmarkInterface) {
    this.client.batch
      .objectsBatchDeleter()
      .withClassName('Bookmark')
      .withWhere({
        path: ['bookmarkID'],
        operator: 'Equal',
        valueText: bookmarkID,
      })
      .do();
  }

  async findBookmark({
    query,
    operations,
    userID,
  }: QueryBookmarkInterface): Promise<SearchResult[]> {
    //TODO: Paginate
    let search = this.client.graphql
      .get()
      .withClassName('Bookmark')
      .withNearText({ concepts: [query], certainty: 0.68 })
      .withLimit(25)
      .withFields(
        'url bookmarkID userID title description content userDescription _additional { certainty }',
      );

    const userIDFilter: WhereFilter = {
      path: ['userID'],
      operator: 'Equal',
      valueText: userID,
    };

    if (operations && operations.length > 0) {
      const operands: WhereFilter[] = operations.map((val: FilterOperator) => ({
        path: [val.field],
        operator: val.operator,
        valueText: val.value,
      }));

      operands.push(userIDFilter);

      search = search.withWhere({
        operator: 'And',
        operands: operands,
      });
    } else {
      search = search.withWhere(userIDFilter);
    }

    const res = await search.do();

    const transformedResults = res.data['Get']['Bookmark']
      .map((data) => ({
        bookmarkID: data.bookmarkID,
        content: data.content,
        certainty: data['_additional'].certainty,
      }))
      .filter(
        (value, index, arr) =>
          arr.findIndex((value2) => value2.bookmarkID === value.bookmarkID) ==
          index,
      );

    return transformedResults;
  }

  //Because of chunking it's just easier to delete and add in batch.
  //Also, can't update indvidual property in weaviate, yet.
  async updateBookmark(bookmark: UpdateBookmarkInterface) {
    let { bookmarkID, ...rest } = bookmark;
    const keysToUpdate = Object.keys(rest).filter((key) => rest[key] !== null);

    const operands: WhereFilter[] = keysToUpdate.map((key) => ({
      path: [key],
      operator: 'IsNull',
      valueBoolean: false,
    }));

    let res = await this.client.graphql
      .get()
      .withClassName('Bookmark')
      .withWhere({
        operator: 'And',
        operands: [
          {
            path: ['bookmarkID'],
            operator: 'Equal',
            valueString: bookmarkID,
          },
          {
            operator: 'Or',
            operands: operands,
          },
        ],
      })
      .withFields('url userID date tags _additional { id }')
      .do();

    const fallback = this.client.graphql
      .get()
      .withClassName('Bookmark')
      .withWhere({
        path: ['bookmarkID'],
        operator: 'Equal',
        valueString: bookmarkID,
      })
      .withFields(
        'url userID date tags description userDescription _additional { id }',
      )
      .withLimit(1);

    const [{ url, date, tags, userID }] =
      res.data['Get']['Bookmark'].length > 0
        ? res.data['Get']['Bookmark']
        : (await fallback.do()).data['Get']['Bookmark'];

    let id_list = res.data['Get']['Bookmark'].map(
      (data) => data['_additional']['id'],
    );

    for (const id of id_list) {
      this.client.data.deleter().withClassName('Bookmark').withId(id);
    }

    this.addBookmark({
      ...bookmark,
      url,
      userID,
      date,
      tags,
    } as CreateBookmarkInterface);
  }

  async purge() {
    this.client.batch
      .objectsBatchDeleter()
      .withClassName('Bookmark')
      .withWhere({
        path: ['bookmarkID'],
        operator: 'NotEqual',
        valueText: '00000000-0000-0000-0000-000000000000',
      })
      .do();
  }
}
