import "reflect-metadata";
import {Container} from "inversify";
import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repository";
import {AuthService} from "../domain/auth-services";
import {JwtUtility} from "../application/jwt-utility";
import {UsersController} from "../controllers/users-controller";
import {AuthController} from "../controllers/auth-controller";
import {EmailAdapter} from "../adapters/email-adapter";
import {attemptModel, userModel} from "../db/mongoose/models";
import {AttemptsDBType, UserDBType} from "../db/types";
import mongoose from "mongoose";
import {TYPES} from "../db/iocTypes";
import {AuthHelperService} from "../domain/auth-helper-service";
import {EmailMessage} from "../adapters/email-message";
import {AttemptsRepository} from "../repositories/attempts-repository";
import {AttemptsService} from "../domain/attempts-service";

export const rootContainer = new Container();

// users and auth
rootContainer.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository);
rootContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
rootContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
rootContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);
rootContainer.bind<AuthHelperService>(TYPES.AuthHelperService).to(AuthHelperService);
rootContainer.bind<JwtUtility>(TYPES.JwtUtility).to(JwtUtility);
rootContainer.bind<EmailAdapter>(TYPES.EmailAdapter).to(EmailAdapter);
rootContainer.bind<UsersService>(TYPES.UsersService).to(UsersService);
rootContainer.bind<EmailMessage>(TYPES.EmailMessage).to(EmailMessage);
rootContainer.bind<mongoose.Model<UserDBType>>(TYPES.userModel).toConstantValue(userModel);
// attempts
rootContainer.bind<AttemptsRepository>(TYPES.AttemptsRepository).to(AttemptsRepository);
rootContainer.bind<AttemptsService>(TYPES.AttemptsService).to(AttemptsService);
rootContainer.bind<mongoose.Model<AttemptsDBType>>(TYPES.attemptModel).toConstantValue(attemptModel);

