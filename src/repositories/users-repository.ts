import {LoginType, PaginatorParamsType, UserDBType, UserFullType, UserInputType} from "../db/types";
import {usersCollection} from "../db/db";
import {DeleteResult, ObjectId} from "mongodb";

export const usersRepository = {
  async findAll({skip, limit}: PaginatorParamsType): Promise<{usersSearch: UserFullType[], usersCount: number }> {

    const usersCount = await usersCollection.count({});

    const usersSearch: UserFullType[] = await usersCollection
      .find({}, {projection: {_id: 0}})
      .skip(skip)
      .limit(limit)
      .toArray()

    return {usersSearch, usersCount};
  },
  async findById(id: string): Promise<UserFullType | null> {
    return await usersCollection.findOne({id}, { projection: { _id: 0 }})
  },
  async findByLogin(login: string): Promise<UserFullType | null> {
    return await usersCollection.findOne({"credentials.login": login},
      {
        projection: {
          _id: 0
        }
      })
  },
  async findByLoginPass({login, password}: LoginType): Promise<UserFullType | null> {

    return await usersCollection.findOne({credentials: {login, password}},
      {
        projection: {
          _id: 0
        }
      })
  },
  async findByEmail(email: string): Promise<UserFullType | null> {
    return await usersCollection.findOne({"credentials.email": email},
      {
        projection: {
          _id: 0
        }
      })
  },
  async create(user: UserFullType): Promise<UserFullType> {
    const userToInsert: UserDBType = {...user, _id: new ObjectId()};
    await usersCollection.insertOne(userToInsert);

    return await usersCollection.findOne({id: user.id}, {
      projection: {
        _id: 0
      }
    }) as UserFullType;
  },
  async delete(id: string): Promise<boolean> {
    const result: DeleteResult = await usersCollection.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  }
}

