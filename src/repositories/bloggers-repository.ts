type BloggerType = {
  id: number,
  name?: string,
  youtubeUrl?: string
}
let bloggers: Array<BloggerType> = [
  {
    "id": 1,
    "name": "Blogger 1",
    "youtubeUrl": "https://blogger1.com"
  },
  {
    "id": 2,
    "name": "Blogger 2",
    "youtubeUrl": "https://blogger2.com"
  }
];

export const bloggersRepository = {
  findAll() {
    return bloggers;
  },
  create(name: string, youtubeUrl?: string) {
    const newBlogger: BloggerType = {id: +(new Date()), name, youtubeUrl: youtubeUrl ? youtubeUrl : ''};
    bloggers.push(newBlogger);
    return newBlogger;
  },
  findById(id: number) {
    return bloggers.find(b => b.id === id);
  },
  update(id: number, name: string, youtubeUrl: string) {
    let blogger = bloggers.find(b => b.id === id);
    if (blogger) {
      blogger.name = name;
      if (youtubeUrl) blogger.youtubeUrl = youtubeUrl;
      return true;
    }
    return false;
  },
  delete(id: number) {
    for (let i = 0; i < bloggers.length; i++) {
      if (bloggers[i].id === id) {
        bloggers.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}