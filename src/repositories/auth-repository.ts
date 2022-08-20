// import {TokenDBType, TokenType} from "../db/types";
// import {authCollection, usersCollection} from "../db/db";
// import {ObjectId} from "mongodb";

export const authRepository = {
  // async create(authToken: TokenType): Promise<TokenType> {
  //   await authCollection.insertOne({_id: new ObjectId(), ...authToken})
  //   return  await authCollection.findOne({id: authToken.id}, {projection: {_id: 0}}) as TokenType;
  //
  // },
  // async findByUserId(userId: string): Promise<TokenType | null> {
  //   const authUser = await authCollection.findOne({$and: [{userId}]}, {projection: {_id: 0}});
  //
  //   if (authUser) {
  //     return authUser;
  //   }
  //   return null
  // },
  // async emailResending(authUser: TokenType): Promise<boolean> {
  //   const result = await authCollection.updateOne({userId: authUser.userId}, {
  //     $set: {...authUser}
  //   });
  //   if (result.matchedCount) return true
  //   return false
  // },
  // async findByCode(confirmationToken: string): Promise<TokenType | null> {
  //   const authUser = await authCollection.findOne({confirmationToken}, {projection: {_id: 0}});
  //   return authUser
  // },
  // async update(userAuth: TokenType): Promise<boolean> {
  //   const result = await authCollection.updateOne({userId: userAuth.userId}, {$set: {...userAuth}})
  //   if (result.matchedCount) {
  //     return true;
  //   }
  //   return false
  // },
  // async findById(id: string): Promise<TokenType | null> {
  //   const authUser = await authCollection.findOne({id}, {projection: {_id: 0}})
  //   return authUser;
  // }
}