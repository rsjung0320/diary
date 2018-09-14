import { Action } from '@ngrx/store';

import { Post } from './post.model';

export const SET_POST = '[Post] Set Post';

export class SetPost implements Action {
  readonly type = SET_POST;

  constructor(public payload: Post[]) {}
}

export type PostActions =
  SetPost;
