import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  PostActions,
  SET_POST
} from './post.actions';
import { Post } from './post.model';
import * as fromRoot from '../app.reducer';

export interface PostState {
  posts: Post[];
}

export interface State extends fromRoot.State {
  post: PostState;
}

const initialState: PostState = {
  posts: []
};

export function postReducer(state = initialState, action: PostActions) {
  switch (action.type) {
    case SET_POST:
      return {
        ...state,
        posts: action.payload
      };
    default: {
      return state;
    }
  }
}

export const getPostState = createFeatureSelector<PostState>('post');

export const getPosts = createSelector(getPostState, (state: PostState) => state.posts);
