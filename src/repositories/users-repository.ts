import {
  LoginType,
  PaginatorParamsType,
  TOKEN_STATUS,
  TokenType,
  UserDBType,
  UserFullType,
  UserInputType
} from "../db/types";
import {usersCollection} from "../db/db";
import {DeleteResult, ObjectId} from "mongodb";

export const usersRepository = {
  async findAll({skip, limit}: PaginatorParamsType): Promise<{ usersSearch: UserFullType[], usersCount: number }> {

    const usersCount = await usersCollection.count({});

    const usersSearch: UserFullType[] = await usersCollection
      .find({}, {projection: {_id: 0}})
      .skip(skip)
      .limit(limit)
      .toArray()

    return {usersSearch, usersCount};
  },
  async findById(id: string): Promise<UserFullType | null> {
    return await usersCollection.findOne({id}, {projection: {_id: 0}})
  },
  async findByLogin(login: string): Promise<UserFullType | null> {
    const user = await usersCollection.findOne({"credentials.login": login},
      {
        projection: {
          _id: 0
        }
      });
    return user
  },
  async findByLoginEmail(login: string, email: string): Promise<UserFullType | null> {
    return await usersCollection.findOne({"credentials.login": login, "credentials.email": email},
      {
        projection: {
          _id: 0
        }
      }
    )
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
  },
  async updateTokenStatus(id: string, tokenStatus: TOKEN_STATUS) {
    const isUpdated = await usersCollection.updateOne({id}, {
      $set: {
        "token.tokenStatus": tokenStatus
      }
    })
    if (isUpdated.matchedCount) return true;
    return false;
  },
  async findByLoginOrEmail(login: any, email: any): Promise<string[]> {
    const result = [];
    const userLogin = await usersCollection.findOne({"credentials.login": login});
    const userEmail = await usersCollection.findOne({"credentials.email": email});
    if (userLogin) result.push("login")
    if (userEmail) result.push("email")

    return result
  },
  async updateToken(id: string, token: TokenType): Promise<boolean> {
    const result = await usersCollection.updateOne({id}, {$set: {token}})
    if (result.matchedCount) return true;
    return false;
  },
  async findByCode(code: string) {
    return await usersCollection.findOne({"token.confirmationToken": code},
      {
        projection: {
          _id: 0
        }
      })
  }
}

