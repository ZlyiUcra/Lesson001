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
import "reflect-metadata";
import {inject, injectable} from "inversify";
import mongoose from "mongoose";
import {TYPES} from "../db/iocTypes";


@injectable()
export class UsersRepository {
  constructor(
    @inject(TYPES.userModel) private userModel: mongoose.Model<UserDBType>) {
  }

  async findAll({skip, limit}: PaginatorParamsType): Promise<{ usersSearch: UserFullType[], usersCount: number }> {

    const usersCount = await this.userModel.count({});

    const usersSearch: UserFullType[] = await this.userModel
      .find({}, projection)
      .skip(skip)
      .limit(limit)
      .lean()

    return {usersSearch, usersCount};
  }

  async findById(id: string): Promise<UserFullType | null> {
    return this.userModel.findOne({id}, projection).lean()
  }

  async findByLogin(login: string): Promise<UserFullType | null> {
    const user = await this.userModel.findOne({"credentials.login": login}, projection).lean();
    return user
  }

  async findByEmail(email: string): Promise<UserFullType | null> {
    return this.userModel.findOne({"credentials.email": email}, projection).lean()
  }

  async create(user: UserFullType): Promise<UserFullType> {

    const userToInsert = new UserDBType(
      new ObjectId(),
      user.id,
      user.credentials,
      user.token,
      user.createdAt
    );

    await this.userModel.insertMany([userToInsert]);

    return await this.userModel.findOne({id: user.id}, projection).lean() as UserFullType;
  }

  async delete(id: string): Promise<boolean> {
    const result: DeleteResult = await this.userModel.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  }

  async updateTokenStatus(id: string, tokenStatus: TOKEN_STATUS) {
    const isUpdated = await this.userModel.updateOne({id}, {
      $set: {
        "token.tokenStatus": tokenStatus
      }
    })

    if (isUpdated.matchedCount) return true;
    return false;
  }

  async findByLoginOrEmail(login: any, email: any): Promise<string[]> {
    const result = [];
    const userLogin = await this.userModel.findOne({"credentials.login": login});
    const userEmail = await this.userModel.findOne({"credentials.email": email});
    if (userLogin) result.push("login")
    if (userEmail) result.push("email")

    return result
  }

  async updateToken(id: string, token: TokenType): Promise<boolean> {
    const result = await this.userModel.updateOne({id}, {$set: {token}})
    if (result.matchedCount) return true;
    return false;
  }

  async findByCode(code: string) {
    return this.userModel.findOne({"token.confirmationToken": code}, projection)
  }
}



