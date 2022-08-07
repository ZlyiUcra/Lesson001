import {productsRepository} from "../repositories/products-repository";
import {ProductDBType} from "../db/types";
import {v4 as uuidv4} from "uuid";

export const productsService = {
  async getAll(): Promise<ProductDBType[]> {
    return await productsRepository.getAll();
  },

  async getById(id: string): Promise<ProductDBType | null> {
    return await productsRepository.getById(id);
  },

  async create(title: string): Promise<ProductDBType> {
    const id = new Date();
    const newProduct = {
      id: uuidv4(),
      title,
      addedAt: id
    };
    return await productsRepository.create(newProduct);
  },

  async update(id: string, title: string): Promise<boolean> {
    return await productsRepository.update(id, title);
  },

  async delete(id: string): Promise<boolean> {
    return await productsRepository.delete(id);
  }
}
