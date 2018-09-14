import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import * as postAction from './post.actions';
import * as fromPost from './post.reducer';
import { Store } from '@ngrx/store';

// 아래 @Injectable({providedIn: 'root'}) 을 안쓰려면 app.module.ts에 providers에 추가 해야 함
@Injectable({ providedIn: 'root' })
export class PostsService {
  private fbSubs: Subscription[] = [];

  // 이러한 방식이 외부에서 접근이 되지 않고, javascript의 외부에서 접근 못하게 막으며, 본래의 posts의 변수는 건들 수 없다고 한다.
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>(); // subject는 observable과 같다고 생각하면 된다.
  uploadProgress;

  constructor(
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromPost.State>) { }

  // getPosts(postsPerPage: number, currentPage: number) {
  getPosts() {
    this.fbSubs.push(
      this.db
        .collection('posts')
        .valueChanges()
        .subscribe((posts: Post[]) => {
          console.log('getPosts :', posts);

          this.store.dispatch(new postAction.SetPost(posts));
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

  uploadImage(file: File) {
    const randomId = Math.random().toString(36).substring(2);
    const ref = this.afStorage.ref(randomId);
    let task = ref.put(file);
    this.uploadProgress = task.percentageChanges();
    const downloadURL = task.snapshotChanges().subscribe(res => {
      console.log('res : ', res);
      
    });
    console.log('downloadURL :', downloadURL);
    
  }

  addPost(title: string, content: string, image: string) {
    console.log('image :', image);

    const postData = {
      title: title,
      content: content,
      imagePath: image
    };

    this.db.collection('posts').add(postData).then(post => {
      console.log(post);
      this.router.navigate(['/']);
    });

    // this.http
    //   .post<{ message: string, post: Post }>(
    //     BACKEND_URL,
    //     postData
    //   )
    //   .subscribe((responseData) => {

    //     this.router.navigate(['/']);
    //   });
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

  deletePost(postId: string) {
    // return this.http.delete(BACKEND_URL + postId);
  }
}
