import {UsersService} from "../users-service";
import {UsersRepository} from "../../repositories/users-repository";
import mongoose from "mongoose";
import {CredentialType, TOKEN_STATUS, TokenType, UserFullType, UserInputType} from "../../db/types";
import {AuthHelperService} from "../auth-helper-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import {userModel} from "../../db/mongoose/models";

describe("integration test for user service", () => {

  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  })

  const usersRepository = new UsersRepository(userModel);
  const authHelperService = new AuthHelperService();
  const usersService = new UsersService(usersRepository, authHelperService);

  describe("user service", () => {
    const email = "test@test.com";
    const login = "login";
    const password = "12345"
    const confirmationToken = "confirmation";
    let user: UserFullType;

    it("should return created user data ", async () => {
      const userCredentials = new CredentialType(login, email, password);
      user = await usersService.create(userCredentials);
      expect(user.credentials.email).toBe(email);
      expect(user.credentials.login).toBe(login);
    })
    it("should return all users", async () => {
      const userInput: UserInputType ={pageNumber: 1, pageSize: 10};
      const users = await usersService.getAll(userInput);

      expect(users.items.length).toBe(1)
    })
    it("should return user by ID", async () => {
      const userById = await usersService.findById(user.id);
      expect(userById).toBeTruthy();
    } )
    it("should return user by login", async () => {
      const userById = await usersService.findByLogin(user.credentials.login);
      expect(userById).toBeTruthy();
    } )
    it("should return user by email", async () => {
      const userById = await usersService.findByEmail(user.credentials.email);
      expect(userById).toBeTruthy();
    })
    it("should return user by login and password", async () => {
      const shortCredentials = { login, password}
      const user = await usersService.findByLoginPass(shortCredentials);
      expect(user).toBeTruthy();
    })
    it("should not return user by login and password", async () => {
      const shortCredentials = { login: login+"1", password}
      const user = await usersService.findByLoginPass(shortCredentials);
      expect(user).toBeFalsy();
    })
    it("should return login and/or email founded by this parameters", async () => {
      const user = await usersService.findByLoginOrEmail(login, email);
      expect(user).toBeTruthy();
    })
    it("should not update user's token", async () => {
      const token: TokenType = { confirmationToken, tokenStatus: TOKEN_STATUS.CONFIRMED, tokenJWT: "123.123.123" }
      const result = await usersService.updateToken(user.id+"0", token);
      expect(result).toBeFalsy();
    })
    it("should update user's token", async () => {
      const token: TokenType = { confirmationToken, tokenStatus: TOKEN_STATUS.CONFIRMED, tokenJWT: "123.123.123" }
      const result = await usersService.updateToken(user.id, token);
      expect(result).toBeTruthy();
    })
    it("should find user by  user's code", async () => {
      const result = await usersService.findByCode(confirmationToken);
      expect(result).toBeTruthy();
    })
    it("should not delete user by id", async () => {
      const result = await usersService.delete(user.id+"0");
      expect(result).toBeFalsy();
    })
    it("should delete user by id", async () => {
      const result = await usersService.delete(user.id);
      expect(result).toBeTruthy();
    })
  })
})