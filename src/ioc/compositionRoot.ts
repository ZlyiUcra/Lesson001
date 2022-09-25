import "reflect-metadata";
import {Container} from "inversify";
import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repository";
import {AuthHelperService, AuthService} from "../domain/auth-services";
import {JwtUtility} from "../application/jwt-utility";
import {UsersController} from "../controllers/users-controller";
import {AuthController} from "../controllers/auth-controller";
import {EmailAdapter} from "../adapters/email-adapter";
import {userModel} from "../db/mongoose/models";
import {UserDBType} from "../db/types";
import mongoose from "mongoose";

export const TYPES = {
  UsersRepository: Symbol.for("UsersRepository"),
  UsersService: Symbol.for("UsersService"),
  UsersController: Symbol.for("UsersController"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  AuthHelperService: Symbol.for("AuthHelperService"),
  JwtUtility: Symbol.for("JwtUtility"),
  EmailAdapter: Symbol.for("EmailAdapter"),
  userModel: Symbol.for("userModel")
};

export const rootContainer = new Container();


rootContainer.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository);
rootContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
rootContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
rootContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);
rootContainer.bind<AuthHelperService>(TYPES.AuthHelperService).to(AuthHelperService);
rootContainer.bind<JwtUtility>(TYPES.JwtUtility).to(JwtUtility);
rootContainer.bind<EmailAdapter>(TYPES.EmailAdapter).to(EmailAdapter);
rootContainer.bind<UsersService>(TYPES.UsersService).to(UsersService);
rootContainer.bind<mongoose.Model<UserDBType>>(TYPES.userModel).toConstantValue(userModel);



