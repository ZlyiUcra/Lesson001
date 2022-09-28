import "reflect-metadata";
import {
  CommentContentType,
  PostCommentsInputType,
  PostCreateType,
  PostPaginatorInputType, PostUpdateType,
  RequestWithFullUser,
  RequestWithShortUser
} from "../db/types";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {PostsServices} from "../domain/posts-services";
import {TYPES} from "../db/iocTypes";
import {CommentsService} from "../domain/comments-services";

@injectable()
export class PostsController {
  constructor(
    @inject<PostsServices>(TYPES.PostsServices) private postServices: PostsServices,
    @inject<CommentsService>(TYPES.CommentsService) private commentsService: CommentsService
  ){}
  async getPosts(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    const searchPostsTerm: PostPaginatorInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
    }
    const posts = await this.postServices.getAll(searchPostsTerm, user?.id);
    return res.send(posts);
  }

  async createPost(req: RequestWithFullUser, res: Response) {
    const postCreate: PostCreateType =
      {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.body.bloggerId
      }
    const user = req.user;
    const post = await this.postServices.create(postCreate, user?.id);

    return res.status(201).send(post);
  }

  async getPostComments(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    const searchPostComments: PostCommentsInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10),
      postId: req.params.postId
    }
    const comments = await this.commentsService.getAll(searchPostComments, user?.id);
    return res.send(comments)
  }

  async createPostComment(req: RequestWithShortUser, res: Response) {
    const commentContent: CommentContentType = {content: req.body.content};
    const user = req.user;
    if (user) {
      const comment = await this.commentsService.create(commentContent, user, req.params.postId);
      return res.status(201).send(comment);
    }
    return res.status(401).send();
  }

  async getPost(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    const post = await this.postServices.findById(req.params.id, user?.id);
    if (post) {
      return res.status(200).send(post);
    }
    return res.status(404).send();
  }

  async updatePost(req: Request, res: Response) {
    const post: PostUpdateType = {
      id: req.params.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerId: req.body.bloggerId
    }
    const isUpdated = await this.postServices.update(post);

    if (isUpdated) {
      return res.status(204).send();
    }
    return res.status(404).send();
  }

  async deletePost(req: Request, res: Response) {
    const isDeleted = await this.postServices.delete(req.params.id);
    if (isDeleted) {
      return res.status(204).send();
    }
    return res.status(404).send();
  }

  async setPostLikeStatus(req: RequestWithFullUser, res: Response) {
    const postId = req.params.postId;
    const likeStatus = req.body.likeStatus;
    const user = req.user

    const isLikedStatus = await this.postServices.likeStatus(postId, likeStatus, user);

    //if(!isLikedStatus) return res.status(401).send();
    res.status(204).send()
  }
}