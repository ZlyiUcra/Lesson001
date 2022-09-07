import {
  LoginType,
  PaginatorParamsType,
  TOKEN_STATUS,
  TokenType,
  UserDBType,
  UserFullType,
  UserInputType
} from "../db/types";
import {DeleteResult, ObjectId} from "mongodb";
import {projection} from "../helpers/constants";
import {userModel} from "../db/mongoose/models";


export const usersRepository = {
  async findAll({skip, limit}: PaginatorParamsType): Promise<{ usersSearch: UserFullType[], usersCount: number }> {

    const usersCount = await userModel.count({});

    const usersSearch: UserFullType[] = await userModel
      .find({}, projection)
      .skip(skip)
      .limit(limit)
      .lean()

    return {usersSearch, usersCount};
  },
  async findById(id: string): Promise<UserFullType | null> {
    return userModel.findOne({id}, projection).lean()
  },
  async findByLogin(login: string): Promise<UserFullType | null> {
    const user = await userModel.findOne({"credentials.login": login}, projection).lean();
    return user
  },
  async findByLoginEmail(login: string, email: string): Promise<UserFullType | null> {
    return userModel.findOne({"credentials.login": login, "credentials.email": email}, projection).lean()
  },
  async findByEmail(email: string): Promise<UserFullType | null> {
    return userModel.findOne({"credentials.email": email}, projection).lean()
  },
  async create(user: UserFullType): Promise<UserFullType> {
    const userToInsert: UserDBType = {...user, _id: new ObjectId()};
    await userModel.insertMany([userToInsert]);

    return await userModel.findOne({id: user.id}, projection).lean() as UserFullType;
  },
  async delete(id: string): Promise<boolean> {
    const result: DeleteResult = await userModel.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  },
  async updateTokenStatus(id: string, tokenStatus: TOKEN_STATUS) {
    const isUpdated = await userModel.updateOne({id}, {
      $set: {
        "token.tokenStatus": tokenStatus
      }
    })
    if (isUpdated.matchedCount) return true;
    return false;
  },
  async findByLoginOrEmail(login: any, email: any): Promise<string[]> {
    const result = [];
    const userLogin = await userModel.findOne({"credentials.login": login});
    const userEmail = await userModel.findOne({"credentials.email": email});
    if (userLogin) result.push("login")
    if (userEmail) result.push("email")

    return result
  },
  async updateToken(id: string, token: TokenType): Promise<boolean> {
    const result = await userModel.updateOne({id}, {$set: {token}})
    if (result.matchedCount) return true;
    return false;
  },
  async findByCode(code: string) {
    return userModel.findOne({"token.confirmationToken": code}, projection)
  }
}

