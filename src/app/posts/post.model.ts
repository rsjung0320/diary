import { Image } from './image.model';
import { UserData } from '../auth/user.model';

export interface Post {
  id: string;
  title: string;
  content: string;
  image: Image;
  creator: string;
  user: UserData;
}

export interface PostId extends Post { id: string; }
