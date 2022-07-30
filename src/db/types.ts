import {WithId} from 'mongodb'

export type BloggerPaginatorInput = {
  searchNameTerm?: string;
  pageNumber: number;
  pageSize: number;
}

export type BloggerDBType = WithId<{
  id: number,
  name?: string,
  youtubeUrl?: string
}>
export type BloggerType = Omit<BloggerDBType, "_id">

export type SearchResultType<T> = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: Array<T>
}

export type PostPaginatorInput = {
  pageNumber: number;
  pageSize: number;
  bloggerId?: number;
}


export type PostDBType = WithId<{
  id: number,
  title: string,
  shortDescription: string,
  content: string,
  bloggerId: number,
  bloggerName?: string
}>

export type PostType = Omit<PostDBType, "_id">

export type ShortPostType = Omit<PostType, "id" | "bloggerName">

export type ProductDBType = WithId<{
  id: number;
  title: string;
  addedAt: Date;
}>
export type ProductType = Omit<ProductDBType, "_id">



