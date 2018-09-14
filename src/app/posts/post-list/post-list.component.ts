import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';

import * as postAction from '../post.actions';
import * as fromPost from '../post.reducer';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts$: Observable<Post[]>; // post-create에서 @Output 한 것을 상위 app.component를 걸쳐서 받는다.
  isLoading$: Observable<boolean>;
  totalPosts = 10;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.posts$ = this.store.select(fromPost.getPosts);
    this.postsService.getPosts();

    // this.userId = this.authService.getUserId();
    // 리스트이기 때문에 Observer가 되야 한다. 상황이 변경이 되면 첫번째, param에서 해당 내역을 처리하고, 두번째 param에서는 error를 세번째 param에는 완료 후 처리 로직이 들어간다.
    // this.postsSub = this.postsService
    //   .getPostUpdateListener()
    //   .subscribe((postData: { posts: Post[], postCount: number }) => {
    //     // 200: Success
    //     this.isLoading = false;
    //     this.totalPosts = postData.postCount;
    //     this.posts = postData.posts;
    //   }, (err) => {
    //     // fail
    //     console.log(err);
    //   }, () => {
    //     // 200: Success,
    //     // TODO 좀 더 알아 볼 것, 후처리가 아니라, Observable이 자신을 종료, 소멸 했을 때, 이벤트를 emit 하는 것을 받아 주는 것 같다.
    //     console.log('Observable / Subject is over / the end');
    //   });

    // this.userIsAuthenticated = this.authService.getIsAuth();
    // this.authStstusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe(isAuthenticated => {
    //     this.userIsAuthenticated = isAuthenticated;
    //     this.userId = this.authService.getUserId();
    //   });
  }

  onChangePage(pageData: PageEvent) {
    // this.isLoading = true;
    // this.currentPage = pageData.pageIndex + 1;
    // this.postsPerPage = pageData.pageSize;
    // this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onEdit(postId: string) {
    // this.router.navigateByUrl('/edit/' + postId);
  }

  onDelete(postId: string) {
    // this.isLoading = true;
    // this.postsService.deletePost(postId).subscribe(() => {
    //   this.postsService.getPosts(this.postsPerPage, this.currentPage);
    // }, () => {
    //   this.isLoading = false;
    // });
  }

  ngOnDestroy() {
    // // Subscription 과 메모리 leak을 없앤다.
    // this.postsSub.unsubscribe();
    // this.authStstusSub.unsubscribe();
  }
}
