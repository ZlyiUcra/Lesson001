import "reflect-metadata";
import {UsersService} from "../domain/users-service";
import {JwtUtility} from "../application/jwt-utility";
import {Request, Response} from "express";
import {CredentialType, UserInputType, UserJWTType} from "../db/types";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";

@injectable()
export class UsersController {
  constructor(
    @inject<UsersService>(TYPES.UsersService) private usersService: UsersService,
    @inject<JwtUtility>(TYPES.JwtUtility) private jwtUtility: JwtUtility) {
  }

  async createUser(req: Request, res: Response) {
    const credentials = new CredentialType(req.body.login, req.body.email, req.body.password)
    const newUser = await this.usersService.create(credentials);
    const refreshToken = await this.jwtUtility.createUserJWT(
      new UserJWTType(newUser.id, newUser.credentials.login, newUser.credentials.email),
      "20d");
    res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: true})
    const {id, credentials: {login}} = newUser;
    res.status(201).send({id, login})
  }

  async deleteUser(req: Request, res: Response) {
    const isDeleted = await this.usersService.delete(req.params.id);
    if (isDeleted) {
      res.status(204).send()
    }
    res.status(404).send()
  }

  async getUsers(req: Request, res: Response) {
    const pageNumber = +(req.query.PageNumber ? req.query.PageNumber : 1);
    const pageSize = +(req.query.PageSize ? req.query.PageSize : 10);

    const searchUsers = new UserInputType(pageNumber, pageSize)
    const users = await this.usersService.getAll(searchUsers)
    res.send(users)
  }
}