import {ObjectId} from "mongodb";
import {ProductDBType, ProductType} from "../db/types";
import {productsCollection} from "../db/db";

export const productsRepository = {
  async getAll(): Promise<ProductDBType[]> {
    return await productsCollection.find({}).toArray();
  },
  async getById(id: string): Promise<ProductDBType | null> {
    return await productsCollection.findOne({id: id});
  },
  async create(product: ProductType): Promise<ProductDBType> {
    const resultProduct: ProductDBType = {...product, _id: new ObjectId()}
    const result = await productsCollection.insertOne(resultProduct);
    return resultProduct;//;{_id: new ObjectId(), title, addedAt: new Date()}
  },
  async update(id: string, title: string): Promise<boolean> {
    const result = await productsCollection.updateOne(
      {id: id},
      {$set: {title: title}})
    return result.matchedCount === 1;
  },
  /*
  Delete user and all his photos
   */
  async delete(id: string): Promise<boolean> {
    const result = await productsCollection.deleteOne({id: id});
    return result.deletedCount === 1;
  }
}
