import {AttemptsType} from "../db/types";
import {attemptsRepository} from "../repositories/attempts-repository";

export class AttemptsService {
  async updateRequests(attempt: AttemptsType): Promise<boolean> {
    return attemptsRepository.updateRequests(attempt);
  }

  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return attemptsRepository.find(ip, url, method)
  }
}

export const attemptsService = new AttemptsService()