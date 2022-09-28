import "reflect-metadata";
import {BlacklistRepository} from "../repositories/blacklist-repository";
import {v4 as uuidv4} from 'uuid';
import {BlacklistType} from "../db/types";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";

@injectable()
export class BlacklistService {
 constructor(
    @inject<BlacklistRepository>(TYPES.BlacklistRepository) private blacklistRepository: BlacklistRepository
  ){}
  async insertToken(refreshToken: string): Promise<boolean> {
    const token: BlacklistType = {id: uuidv4(), refreshToken}
    return this.blacklistRepository.insert(token)
  }
  async findByRefreshToken(refreshToken: string): Promise<string |null>{
    return  this.blacklistRepository.findByRefreshToken(refreshToken);
  }
}
