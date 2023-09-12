import BookmarkEntity from '../bookmark.entity';

export type Bookmark = {
  content: string;
  description?: string;
  tags?: string[];
  date: Date;
  summary?: string;
  userID: string;
  url: string;
  bookmarkID: string;
};

type BookmarkKeys = keyof BookmarkEntity;
export interface FindBookmarkInterface {
  column: BookmarkKeys;
  value: BookmarkEntity[BookmarkKeys];
}

export enum VecField {
  Date = 'date',
  Url = 'url',
}
export enum Operator {
  GreaterThanEqual = 'GreaterThanEqual',
  LessThanEqual = 'LessThanEqual',
  Equal = 'Equal',
  Like = 'Like',
}
export type FilterOperator = {
  field: string;
  operator: Operator;
  value: string;
};

export interface CreateBookmarkInterface {
  content: string;
  description?: string;
  userDescription?: string;
  tags?: string[];
  date: Date;
  title: string;
  summary?: string;
  url: string;
  userID: string;
  bookmarkID: string;
}

export interface DeleteBookmarkInterface {
  bookmarkID: string;
}

export interface QueryBookmarkInterface {
  query: string;
  userID: string;
  operations: FilterOperator[];
}

export interface UpdateBookmarkInterface {
  bookmarkID: string;
  title?: string;
  content?: string;
  description?: string;
  userDescription?: string;
  tags?: string[];
  summary?: string;
}
