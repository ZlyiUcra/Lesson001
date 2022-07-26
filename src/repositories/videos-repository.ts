export type VideoType = {
  id: number,
  title?: string,
  author?: string
}

let videos: Array<VideoType> = []


export const videosRepository = {
  findVideos() {
    return videos;
  },
  createVideo(title: string, author?: string) {
    const newVideo: VideoType = {id: +(new Date()), title: title, author: author ? author : ""};
    videos.push(newVideo);
    return newVideo;
  },
  findVideoById(id: number) {
    return videos.find(video => video.id === id);
  },
  updateVideo(id: number, title: string, author?: string) {
    let video = videos.find(video => video.id === id);
    if (video) {
      video.title = title;
      if (typeof author === "string") {
        video.author = author;
      }
      return true;
    } else {
      return false;
    }
  },
  deleteVideo(id: number) {
    for (let i = 0; i < videos.length; i++) {
      if (videos[i].id === id) {
        videos.splice(i, 1);
        return true
      }
    }
    return false;
  }
}