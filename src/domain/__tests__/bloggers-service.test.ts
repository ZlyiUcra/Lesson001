import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {BloggersRepository} from "../../repositories/bloggers-repository";
import {BloggersService} from "../bloggers-services";
import {bloggerModel} from "../../db/mongoose/models";
import {BloggerPaginatorInputType, BloggerType} from "../../db/types";

describe("integration test for bloggers service", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  const bloggersRepository = new BloggersRepository(bloggerModel);
  const bloggersService = new BloggersService(bloggersRepository);
  let blogger: BloggerType;

  describe("blogger service", () => {
    const name = "Blogger name";
    const youtubeUrl = "www.youtube.com/link"

    it("should return created blogger", async () => {
      blogger = await bloggersService.create(name, youtubeUrl);
      expect(blogger).toBeTruthy()
    });
    it("should return all bloggers with search term", async () => {
      const paginatorInput: BloggerPaginatorInputType = {searchNameTerm: "Blogger", pageNumber: 1, pageSize: 10};

      const bloggers = await bloggersService.findAll(paginatorInput)

      expect(bloggers.items.length).toBe(1);
    });
    it("should return all bloggers without search term", async () => {
      const paginatorInput: BloggerPaginatorInputType = {searchNameTerm: undefined, pageNumber: 1, pageSize: 10};

      const bloggers = await bloggersService.findAll(paginatorInput)

      expect(bloggers.items.length).toBe(1);
    });
    it("should return blogger", async () => {

      const bloggerFound: BloggerType | null = await bloggersService.findById(blogger.id)

      expect(bloggerFound).toBeTruthy();
    })
    it("should update blogger", async () => {
      const userForUpdate: BloggerType = {id: blogger.id, name: "New blogger name", youtubeUrl:"https://www.youtube.link"}
      const bloggerFound = await bloggersService.update(userForUpdate)

      expect(bloggerFound).toBeTruthy();
    })
    it("should not update blogger", async () => {
      const userForUpdate: BloggerType = {id: "1", name: "New blogger name", youtubeUrl:"https://www.youtube.link"}
      const bloggerFound = await bloggersService.update(userForUpdate)

      expect(bloggerFound).toBeFalsy();
    });
    it("should not delete blogger", async () => {

      const bloggerDeleted = await bloggersService.delete("1");

      expect(bloggerDeleted).toBeFalsy();
    });
    it("should delete blogger", async () => {

      const bloggerDeleted = await bloggersService.delete(blogger.id);

      expect(bloggerDeleted).toBeTruthy();
    })
  })
})