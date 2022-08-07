import {PostDBType, PostPaginatorInputType, PostType} from "../db/types";
import {postsCollection} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

let posts: Array<PostType> = [
  // {
  //   id: 1,
  //   title: "title1",
  //   shortDescription: "shortDescription1",
  //   content: "content1",
  //   bloggerId: 1,
  //   bloggerName: "bloggerName1"
  // },
  // {
  //   id: 2,
  //   title: "title2",
  //   shortDescription: "shortDescription2",
  //   content: "content2",
  //   bloggerId: 1,
  //   bloggerName: "bloggerName1"
  // },
  // {
  //   id: 3,
  //   title: "title1",
  //   shortDescription: "shortDescription1",
  //   content: "content1",
  //   bloggerId: 2,
  //   bloggerName: "bloggerName2"
  // }
];

export const postsRepository = {
  async findAll(paginatorInput: PostPaginatorInputType):
    Promise<{ postsSearchResult: PostType[], postsCount: number }> {

    const {pageNumber = 1, pageSize = 10, bloggerId} = paginatorInput;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const searchTerm =  bloggerId ? {bloggerId} : {}

    const postsCount = await postsCollection.count(searchTerm);
    
    const postsSearch: PostDBType[] = await postsCollection
      .find(searchTerm)
      .skip(skip).limit(limit)
      .toArray();

    const postsSearchResult: PostType[] = postsSearch.map((e: PostDBType): PostType => {
      const {_id, ...rest} = e;
      return rest;
    })

    return {postsSearchResult, postsCount};
  },
  async create(newPost: PostType): Promise<PostType> {

    const resultPost: PostDBType = {
      ...newPost,
      _id: new ObjectId()
    };
    await postsCollection.insertOne(resultPost)
    return newPost;
  },
  async findById(id: string): Promise<PostType | null> {
    const result: PostDBType | null = await postsCollection.findOne({id});

    if (!result) return null;
    const {_id, ...post} = result;
    return post;

  },
  async update(newPost: PostType): Promise<boolean> {
    const {id, ...rest} = newPost;
    let result: UpdateResult =
      await postsCollection.updateOne({id}, {$set: {...rest}})
    if (result.modifiedCount) {
      return true;
    }
    return false;
  },
  async delete(id: string): Promise<boolean> {
    let result: DeleteResult = await postsCollection.deleteOne({id});
    if (result.deletedCount) return true
    return false;
  }
}