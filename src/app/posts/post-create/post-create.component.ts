import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';
import { Image } from '../image.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading$: Observable<boolean>;
  form: FormGroup;
  imagePreview: string;
  image: Image = <any>{};

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  // downloadURLString: string;

  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    private storage: AngularFireStorage,
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private store: Store<fromRoot.State>
    ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    // 한 화면에서 create or edit 인지를 판단하여 화면을 reuse 한다.
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');


        // TODO

        // this.isLoading = true;
        // this.postsService.getPost(this.postId).subscribe(postData => {
        //   this.isLoading = false;
        //   this.post = {
        //     id: postData._id,
        //     title: postData.title,
        //     content: postData.content,
        //     imagePath: postData.imagePath,
        //     creator: postData.creator
        //   };
        //   this.form.setValue({
        //     title: this.post.title,
        //     content: this.post.content,
        //     image: this.post.imagePath
        //   });
        // });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); // formGroup의 value에 넣기 위함이다.
    this.form.get('image').updateValueAndValidity(); // 실제 updateValueAndValidity를 해야 formGroup의 value에 값이 들어간다.

    const randomId = Math.random().toString(36).substring(2);
    const filePath = 'SkinImages/' + randomId;

    const fileRef = this.storage.ref(filePath);
    const user = this.authService.getUser();
    const task = fileRef.put(file, { customMetadata: { userId: user.uid, email: user.email } });

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getMetadata().subscribe(res => {
          this.image.path = res.fullPath;
          this.image.meta = res.customMetadata;
          this.image.uid = res.customMetadata.userId;
        });
        fileRef.getDownloadURL().subscribe(res => {
          this.image.url = res;
        });
      })
    ).subscribe(res => {
    }, err => {}
    , () => {
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();

    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    // TODO
    // if (this.form.invalid) {
    //   console.log('2');
    //   return;
    // }
    // this.isLoading = true; // 어짜피 다른곳에 갔다가 다시 이 화면이 불려지면 false로 변경되기 때문에 아래에 false로 명시적으로 넣지 않는다.
    if (this.mode === 'create') {
      this.postsService.addPost(this.authService.getUser(), this.form.value.title, this.form.value.content, this.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    // this.form.reset();
  }

}
