import {TokenDBType, TokenType} from "../db/types";
import {authCollection, usersCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const authRepository = {
  async create(authToken: TokenType): Promise<TokenType> {
    await authCollection.insertOne({_id: new ObjectId(), ...authToken})
    const result = await authCollection.findOne({id: authToken.id}) as TokenDBType
    const {_id, ...authTokenInfo} = result;
    return authTokenInfo
  },
  async findByUserIdAndIP(userId: string, ip: string): Promise<TokenType | null> {
    const authUser = await authCollection.findOne({$and: [{userId}, {ip}]}, {projection: {_id: 0}});

    if (authUser) {
      return authUser;
    }
    return null
  },
  async updateAttemptsShortTimeCounter(userId: string, attemptsCount: number): Promise<boolean> {
    const result = await authCollection.updateOne(
      {userId},
      {
        $set: {
          limitTimeCount: attemptsCount,
          lastRequestedAt: new Date()
        }
      });

    if (result.matchedCount) {
      return true
    }

    return false
  },
  async emailResending(authUser: TokenType): Promise<boolean> {
    const result = await authCollection.updateOne({userId: authUser.userId}, {
      $set: {...authUser}
    });
    if (result.matchedCount) return true
    return false
  },
  async findByUserId(userId: string): Promise<TokenType | null> {
    const authUser = await authCollection.findOne({userId}, {projection: {_id: 0}})
    return authUser;
  },
  async findByCodeAndIP(confirmationToken: string, ip: string): Promise<TokenType | null> {
    const authUser = authCollection.findOne({$and: [{confirmationToken}, {ip}]}, {projection: {_id: false}});
    return authUser
  },
  async update(userAuth: TokenType): Promise<boolean> {
    const result = await authCollection.updateOne({userId: userAuth.userId}, {$set:{...userAuth}})
    if(result.matchedCount){
      return true;
    }
    return false
  },
  async findById(id: string): Promise<TokenType | null> {
    const authUser = await authCollection.findOne({id}, {projection: {_id: 0}})
    return authUser;
  }
}