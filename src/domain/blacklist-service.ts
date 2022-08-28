import {blacklistRepository} from "../repositories/blacklist-repository";
import {v4 as uuidv4} from 'uuid';
import {BlacklistType} from "../db/types";

export const blacklistService = {
  async insertToken(refreshToken: string): Promise<boolean> {
    const token: BlacklistType = {id: uuidv4(), refreshToken}
    return blacklistRepository.insert(token)
  },
  async findByRefreshToken(refreshToken: string): Promise<string |null>{
    return  blacklistRepository.findByRefreshToken(refreshToken);
  },
}