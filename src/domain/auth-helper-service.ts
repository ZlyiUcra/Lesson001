import {injectable} from "inversify";
import bcrypt from "bcrypt";

@injectable()
export class AuthHelperService {
  generateHash = async (password: string, saltOrRounds: number = 10): Promise<string> => {
    const hash = await bcrypt.hash(password, saltOrRounds)
    return hash
  }

  isPasswordCorrect = async (password: string, hash: string) => {
    const compareResult: boolean = await bcrypt.compare(password, hash)
    return compareResult
  }
}