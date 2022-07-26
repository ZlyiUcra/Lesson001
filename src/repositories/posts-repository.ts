import {PostType} from "../db/types";

let posts: Array<PostType> = [
  // {
  //   id: 1,
  //   title: "title1",
  //   shortDescription: "shortDescription1",
  //   content: "content1",
  //   bloggerId: 1,
  //   bloggerName: "bloggerName1"
  // },
  // {
  //   id: 2,
  //   title: "title2",
  //   shortDescription: "shortDescription2",
  //   content: "content2",
  //   bloggerId: 1,
  //   bloggerName: "bloggerName1"
  // },
  // {
  //   id: 3,
  //   title: "title1",
  //   shortDescription: "shortDescription1",
  //   content: "content1",
  //   bloggerId: 2,
  //   bloggerName: "bloggerName2"
  // }
];

export const postsRepository = {
  findAll() {
    return posts;
  },
  create(title: string,
         shortDescription: string,
         content: string,
         bloggerId: number) {
    const id = +(new Date());

    const newPost: PostType = {
      id,
      title,
      shortDescription,
      content, bloggerId,
      bloggerName: `bloggerName_${id}`
    };
    posts.push(newPost);
    return newPost;
  },
  findById(id: number) {
    return posts.find(p => p.id === id);
  },
  update(id: number, title: string,
         shortDescription: string,
         content: string,
         bloggerId: number) {
    let post = posts.find(p => p.id === id);
    if (post) {
      post.title = title;
      post.shortDescription = shortDescription;
      post.content = content;
      post.bloggerId = bloggerId;
      return true;
    }
    return false;
  },
  delete(id: number) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        posts.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}