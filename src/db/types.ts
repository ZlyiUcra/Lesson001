import {WithId} from 'mongodb'

export type BloggerType = {
  id: number,
  name?: string,
  youtubeUrl?: string
}
export type BloggerDBType = WithId<{
  id: number,
  name?: string,
  youtubeUrl?: string
}>
export type PostType = {
  id: number,
  title: string,
  shortDescription: string,
  content: string,
  bloggerId: number,
  bloggerName: string
}
export type PostDBType = WithId<{
  userName: string
  description: string
  addedAt: Date
}>

export type ProductDBType = WithId<{
  id: number;
  title: string;
  addedAt: Date;
}>

export type ProductType = Omit<ProductDBType, "_id">