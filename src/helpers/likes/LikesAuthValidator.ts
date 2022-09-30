import {inject, injectable} from "inversify";
import {JwtUtility} from "../../application/jwt-utility";
import {TYPES} from "../../db/iocTypes";
import {UsersService} from "../../domain/users-service";

@injectable()
export class LikesAuthValidator {
  constructor(
    @inject<JwtUtility>(TYPES.JwtUtility) private jwtUtility: JwtUtility,
    @inject<UsersService>(TYPES.UsersService) private usersService: UsersService
  ) {
  }
  async likesAuthValidator(headerAuthorization: string | undefined) {
    const headerAuth = headerAuthorization;
    const accessToken = headerAuth?.split(" ")[1] || "";
    const isBearer = headerAuth?.split(" ")[0].trim() === "Bearer" && accessToken.split(".").length === 3;
    let userJWT = await this.jwtUtility.extractUserJWTFromToken(accessToken);

    const user = await this.usersService.findById(userJWT?.id as string);
    // console.log("likesAuthValidator: ",
    //   "\n1.", headerAuth,
    //   "\n2.", accessToken,
    //   "\n3.", userJWT,
    //   "\n4.", user,
    //   "\n5.", isBearer)
    return {headerAuth, accessToken, userJWT, user, isBearer}
  }
}