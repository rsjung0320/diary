import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';

import { Post } from './post.model';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Store } from '@ngrx/store';

import * as postAction from './post.actions';
import * as fromPost from './post.reducer';
import * as UI from '../shared/ui.actions';
import { UIService } from '../shared/ui.service';
import { take } from 'rxjs/operators';

// 아래 @Injectable({providedIn: 'root'}) 을 안쓰려면 app.module.ts에 providers에 추가 해야 함
@Injectable({ providedIn: 'root' })
export class PostsService {
  private fbSubs: Subscription[] = [];

  // 이러한 방식이 외부에서 접근이 되지 않고, javascript의 외부에서 접근 못하게 막으며, 본래의 posts의 변수는 건들 수 없다고 한다.
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>(); // subject는 observable과 같다고 생각하면 된다.
  uploadProgress;

  constructor(
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromPost.State>,
    private uiService: UIService
  ) { }

  // getPosts(postsPerPage: number, currentPage: number) {
  getPosts() {
    this.fbSubs.push(
      this.db
        .collection('posts')
        .valueChanges()
        .subscribe((posts: Post[]) => {
          console.log(posts);

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
    const task = ref.put(file);
    this.uploadProgress = task.percentageChanges();
    const downloadURL = task.snapshotChanges().subscribe(res => {
      console.log('res : ', res);

    });
    console.log('downloadURL :', downloadURL);

  }

  addPost(title: string, content: string, image: string) {
    const postData = {
      title: title,
      content: content,
      imagePath: image
    };

    this.store.select(fromPost.getPosts).pipe(take(1)).subscribe(post => {
      console.log('post :', post);
      this.db.collection('posts').add(postData)
      .then(res => {
        console.log('res :', res);
        this.router.navigate(['/']);
      });
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

  deletePost(postId: string) {
    this.store.dispatch(new UI.StartLoading());
    console.log('postId :', postId);

    const postRef = this.db.collection('posts').doc(postId);
    // postRef.update({
    //   id: firebase.firestore.FieldValue.delete()
    // }).then(post => {
    //   this.store.dispatch(new UI.StopLoading());
    //   this.router.navigate(['/']);
    // }).catch(err => {
    //   this.store.dispatch(new UI.StopLoading());
    //   this.uiService.showSnackbar(err.message, null, 3000);
    // });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
