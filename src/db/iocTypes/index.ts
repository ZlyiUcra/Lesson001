import {EmailMessage} from "../../adapters/email-message";
import {attemptModel} from "../mongoose/models";
import {AttemptsRepository} from "../../repositories/attempts-repository";

export const TYPES = {
  //user and auth with derivatives
  UsersRepository: Symbol.for("UsersRepository"),
  UsersService: Symbol.for("UsersService"),
  UsersController: Symbol.for("UsersController"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  AuthHelperService: Symbol.for("AuthHelperService"),
  JwtUtility: Symbol.for("JwtUtility"),
  EmailAdapter: Symbol.for("EmailAdapter"),
  userModel: Symbol.for("userModel"),
  EmailMessage: Symbol.for("EmailMessage"),
  // attempts and derivatives
  attemptModel: Symbol.for("attemptModel"),
  AttemptsRepository: Symbol.for("AttemptsRepository"),
  AttemptsService: Symbol.for("AttemptsService"),

};