type VideoType = {
  id: number,
  title?: string,
  author?: string
}
// const videos: Array<VideoType> = [
//   {
//     id: 1,
//     title: "Video 1",
//     author: "Author 1"
//   },
//   {
//     id: 2,
//     title: "Video 2",
//     author: "Author 2"
//   },
//   {
//     id: 3,
//     title: "Video 3",
//     author: "Author 3"
//   }
// ]
let videos: Array<VideoType> = [];

export const videosRepository = {
  findVideos() {
    return [...videos];
  },
  createVideo(title: string, author?: string) {
    const newVideo: VideoType = {id: +(new Date()), title: title};
    if(typeof author === "string") newVideo.author = author;
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
      if(typeof author === "string"){
        video.author = author;
      }
      return true;
    } else {
      return false;
    }
  },
  deleteVideo(id: number){
    for (let i = 0; i < videos.length; i++) {
      if (videos[i].id === id) {
        videos.splice(i, 1);
        return true
      }
    }
    return false;
  }
}