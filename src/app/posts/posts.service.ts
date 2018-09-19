import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, Observable } from 'rxjs';

import { Post, PostId } from './post.model';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Store } from '@ngrx/store';

import * as postAction from './post.actions';
import * as fromPost from './post.reducer';
import * as UI from '../shared/ui.actions';
import { UIService } from '../shared/ui.service';
import { take, map, finalize } from 'rxjs/operators';
import { UserData } from '../auth/user.model';
import { Image } from './image.model';

// 아래 @Injectable({providedIn: 'root'}) 을 안쓰려면 app.module.ts에 providers에 추가 해야 함
@Injectable({ providedIn: 'root' })
export class PostsService {
  private fbSubs: Subscription[] = [];

  // 이러한 방식이 외부에서 접근이 되지 않고, javascript의 외부에서 접근 못하게 막으며, 본래의 posts의 변수는 건들 수 없다고 한다.
  // private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>(); // subject는 observable과 같다고 생각하면 된다.

  private postsCollection: AngularFirestoreCollection<Post>;
  posts: Observable<PostId[]>;

  uploadProgress;

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromPost.State>,
    private uiService: UIService
  ) {
    this.postsCollection = afs.collection('posts');
  }

  // getPosts(postsPerPage: number, currentPage: number) {
  getPosts() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.postsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Post;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      ).subscribe(res => {
        console.log('getPosts :', res);

        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new postAction.SetPost(res));
      }, err => {
        this.store.dispatch(new UI.StopLoading());
        console.log(err);
      })
    );

    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // this.http
    //   .get<{ message: string, posts: any, maxPosts: number }>(
    //     BACKEND_URL + queryParams
    //   )
    //   .pipe(
    //     map((postData) => {
    //       return {
    //         posts: postData.posts.map(post => {
    //           return {
    //             title: post.title,
    //             content: post.content,
    //             id: post._id,
    //             imagePath: post.imagePath,
    //             creator: post.creator
    //           };
    //         }),
    //         maxPosts: postData.maxPosts
    //       };
    //     }))
    //   .subscribe(transformedPostsData => {

    //     this.posts = transformedPostsData.posts;
    //     this.postsUpdated.next({
    //       posts: [...this.posts],
    //       postCount: transformedPostsData.maxPosts
    //     });
    //   });
  }

  getPostUpdateListener() {
    // return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(
    //   BACKEND_URL + id
    // );
  }

  addPost(user: UserData, title: string, content: string, image: Image) {
    this.store.dispatch(new UI.StartLoading());
    this.store.select(fromPost.getPosts).pipe(take(1))
      .subscribe(post => {
        const postData = { title, date: new Date(), content, image, user };
        // this.afs.collection('posts').doc(uid).collection('post').add(postData);
        this.afs.collection('posts').add(postData)
          .then(res => {
            this.store.dispatch(new UI.StopLoading());
            this.router.navigate(['/']);
          }).catch(err => {
            this.store.dispatch(new UI.StopLoading());
            console.error('err :', err);
          });
      });
  }

  deletePost(postId: string) {
    // TODO 사진도 찾아서 지운다.

    this.store.dispatch(new UI.StartLoading());

    this.afs.collection('posts').doc(postId).delete().then(res => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(err => {
      this.store.dispatch(new UI.StopLoading());
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // let postData: Post | FormData;

    // if (typeof (image) === 'object') {
    //   postData = new FormData();
    //   postData.append('id', id);
    //   postData.append('title', title);
    //   postData.append('content', content);
    //   postData.append('image', image, title);
    // } else {
    //   postData = {
    //     id: id,
    //     title: title,
    //     content: content,
    //     imagePath: image,
    //     creator: null
    //   };
    // }
    // this.http
    //   .put(BACKEND_URL + id, postData)
    //   .subscribe((response) => {

    //     this.router.navigate(['/']);
    //   });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
