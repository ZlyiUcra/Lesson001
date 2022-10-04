import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UsersRepository} from "../../repositories/users-repository";
import {userModel} from "../../db/mongoose/models";
import {AuthHelperService} from "../auth-helper-service";
import {UsersService} from "../users-service";
import {JwtUtility} from "../../application/jwt-utility";
import {EmailAdapter} from "../../adapters/email-adapter";
import {EmailMessage} from "../../adapters/email-message";
import {AuthService} from "../auth-services";
import {CredentialType, JWTType, LoginType, TOKEN_STATUS, TokenType, UserFullType} from "../../db/types";
import {throws} from "assert";

describe("integration tests for auth service", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  const usersRepository = new UsersRepository(userModel);
  const authHelperService = new AuthHelperService();
  const jwtUtility = new JwtUtility();
  //const emailAdapter = new EmailAdapter();

  const emailAdapterMock: jest.Mocked<EmailAdapter> = {
    sendEmail: jest.fn()
  };
  // @ts-ignore
  const emailAdapterExceptionMock: jest.Mocked<EmailAdapter> = {
    // @ts-ignore
    sendEmail: jest.fn().mockImplementation(() => {throw new Error()})
  };


  const emailMessage = new EmailMessage();

  const authService = new AuthService(usersRepository,
    authHelperService,
    jwtUtility,
    emailAdapterMock,
    emailMessage);

  const authExceptionService = new AuthService(usersRepository,
    authHelperService,
    jwtUtility,
    emailAdapterExceptionMock,
    emailMessage);

  const usersService = new UsersService(usersRepository, authHelperService);

  describe("auth service", () => {
    const email = "test@test.com";
    const login = "login";
    const password = "12345"
    let confirmationToken = "confirmation";
    const userCredentials = new CredentialType(login, email, password);

    describe("confirmation code", () => {
      it("should update email confirmation by code", async () => {
        const user = await usersService.create(userCredentials);

        const token: TokenType = {confirmationToken, tokenStatus: TOKEN_STATUS.NONE, tokenJWT: "123.123.123"}
        await usersService.updateToken(user.id, token);
        const result = await authService.emailConfirmedByCode("confirmation");
        expect(result).toBe(true)
      })
      it("should not update email confirmation by code", async () => {
        const result = await authService.emailConfirmedByCode("notTheOne");
        expect(result).toBe(false)
      })
    })
    describe("login", () => {
      it("should login", async () => {
        const credentials: LoginType = {login, password};
        const result = await authService.login(credentials);
        expect(result).toBeTruthy();

      })
      it("should login with another expiration time", async () => {
        const credentials: LoginType = {login, password};

        const result5h = await authService.login(credentials, "5h");

        expect(result5h).toBeTruthy();


      })
      it("should not login", async () => {
        const credentials: LoginType = {login: login + "0", password};

        const result = await authService.login(credentials);

        expect(result).toBeFalsy()

      })
    })

    describe("registration", () => {

      it("should pass registration", async () => {
        const userCredentials = new CredentialType("login1", "email@email1.com", "123321");

        const result = await authService.registration(userCredentials);
        expect(emailAdapterMock.sendEmail).toBeCalled()
        expect(result).toBeTruthy()
      })
      it("should not pass registration", async () => {
        const userCredentials = new CredentialType("login1", "email@email1.com", "123321");

        const result = await authExceptionService.registration(userCredentials);
        expect(result).toBeFalsy();
      })
    })

    describe("email resending", () => {
      let user: UserFullType;

      beforeAll(async () => {
        await mongoose.connection.db.dropDatabase();
        const userCredentials = new CredentialType(login, email, password);
        user = await usersService.create(userCredentials);
        const token: TokenType = {confirmationToken, tokenStatus: TOKEN_STATUS.SENT, tokenJWT: "123.123.123"}
        await usersService.updateToken(user.id, token)
      })
      it("should not resend because of wrong email", async () => {
        const result = await authService.emailResending("email@not.ex");
        expect(result).toBeFalsy()
      })

      it("should resend email", async () => {
        const result = await authService.emailResending(email);
        expect(result).toBeTruthy()
      })

      it("should not resend email because of status", async () => {
        const token: TokenType = {confirmationToken, tokenStatus: TOKEN_STATUS.CONFIRMED, tokenJWT: "123.123.123"}
        await usersService.updateToken(user.id, token)
        const result = await authService.emailResending(email);
        expect(result).toBeFalsy()
      })
      it("should not resend email because exception", async () => {
        const token: TokenType = {confirmationToken, tokenStatus: TOKEN_STATUS.NONE, tokenJWT: "123.123.123"}
        await usersService.updateToken(user.id, token)
        const result = await authExceptionService.emailResending(email);
        expect(result).toBeFalsy()
      })
    })
  })

})