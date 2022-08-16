import {LoginType, UserDBType, UserInputType, UserType, UserWithHashedPasswordType} from "../db/types";
import {usersCollection} from "../db/db";
import {DeleteResult, ObjectId} from "mongodb";

export const usersRepository = {
  async findAll(usersInput: UserInputType): Promise<{ usersSearchResult: UserType[], usersCount: number }> {
    const {pageNumber, pageSize} = usersInput;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const usersCount = await usersCollection.count({});

    const usersSearch: UserDBType[] = await usersCollection
      .find({})
      .skip(skip)
      .limit(limit)
      //.sort({createdAt: 1})
      .toArray()

    const usersSearchResult: UserType[] = usersSearch.map((u: UserDBType): UserType => {
      const {_id, passwordHash, createdAt, ...user} = u;
      return user
    })

    return {usersSearchResult, usersCount};
  },
  async findById(id: string): Promise<UserType | null> {
    const userDB = await usersCollection.findOne({id});
    if (userDB) {
      const {_id, passwordHash, createdAt, ...user} = userDB;
      return user;
    }
    return null;

  },
  async findByLogin(login: string): Promise<UserWithHashedPasswordType | null> {
    const userDB = await usersCollection.findOne({login});

    if (userDB) {
      const {_id, ...user} = userDB;
      return user;
    }
    return null;
  },
  async findByLoginAndEmail(login: string, email: string): Promise<UserWithHashedPasswordType | null> {

    const userDB = await usersCollection.findOne({
      $and: [{login}, {email}]
    }, {projection:{ _id: 0 }});
    if (userDB) {
      return userDB;
    }
    return null;
  },

  async create(user: UserWithHashedPasswordType): Promise<UserType> {
    const userToInsert: UserDBType = {...user, _id: new ObjectId()};
    await usersCollection.insertOne(userToInsert);

    return await usersCollection.findOne({id: user.id}, {projection:{ _id: 0, passwordHash: 0, createdAt: 0 }}) as UserType;
  },

  async delete(id: string): Promise<boolean> {
    const result: DeleteResult = await usersCollection.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  },

  async findByEmail(email: string):Promise<UserType | null> {
    return usersCollection.findOne({email},{projection:{_id: 0, passwordHash: 0, createdAt: 0}});
  }
}

