export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}

export interface PostId extends Post { id: string; }
