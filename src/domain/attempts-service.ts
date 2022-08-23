import {AttemptsType} from "../db/types";
import {attemptsRepository} from "../repositories/attempts-repository";

export const attemptsService = {
  async update(attempt: AttemptsType): Promise<boolean> {
    return  attemptsRepository.update(attempt);
  },
  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return  attemptsRepository.find(ip, url, method)
  }
}