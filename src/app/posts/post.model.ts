import { Image } from './image.model';
import { UserData } from '../auth/user.model';
import { DateData } from './date.model';

export interface Post {
  id: string;
  title: string;
  content: string;
  image: Image;
  date: DateData;
  user: UserData;
}

export interface PostId extends Post { id: string; }
