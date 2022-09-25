import {CredentialType, TOKEN_STATUS, TokenType, UserFullType} from "../../db/types";
import {AuthHelperService} from "../../domain/auth-services";
import {v4 as uuidv4} from "uuid";

export const userForRepository = async (
  userCredentials: CredentialType,
  authHelperService: AuthHelperService,
  status: TOKEN_STATUS ): Promise<UserFullType> => {

  const passwordHash = await authHelperService.generateHash(userCredentials.password);

  const credentials = new CredentialType(userCredentials.login, userCredentials.email, passwordHash);

  const token = new TokenType(uuidv4(), status, '')
  const user = new UserFullType(uuidv4(), credentials, token, new Date())
  return user
}