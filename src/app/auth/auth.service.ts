import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';
import { Store } from '@ngrx/store';
import { PostsService } from '../posts/posts.service';
import { UserData } from './user.model';
import * as firebase from 'firebase';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {

  userData: UserData;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private postService: PostsService,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      console.log('user :', user);

      if (user) {
        this.userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL
        };

        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/']);
      } else {
        this.userData = null;
        this.trainingService.cancelSubscriptions();
        this.postService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  getUser() {
    return this.userData;
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // 알아서 AppCompononet가 다시 불리면서 initAuthListener()를 호출한다.
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(err => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(err.message, null, 3000);
      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then( (credential) => {
        this.updateUserData(credential.user);
      });
  }

  private updateUserData(user) {
    // sets user data to firestore on login
    const userRef: AngularFirestoreDocument<UserData> = this.afs.doc(`users/${user.uid}`);

    const data: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL
    };

    return userRef.set(data);
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(credential => {
        this.updateUserData(credential.user);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(err => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(err.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
