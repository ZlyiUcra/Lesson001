import {productsRepository} from "../repositories/products-repository";
import {ProductDBType} from "../db/types";

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
      id: +id,
      title,
      addedAt: id
    };
    return await productsRepository.create(newProduct);
  },
  async update(id: string, title: string): Promise<boolean> {
    return await productsRepository.update(id, title);
  },
  /*
  Delete user and all his photos
   */
  async delete(id: string): Promise<boolean> {
    return await productsRepository.delete(id);
  }
}
