import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import * as firebase from "firebase/app";
import { user } from '../models/user';

@Injectable()
export class AuthService {

  user: Observable<user>;

  constructor(public afAuth: AngularFireAuth, public db: AngularFirestore) {

    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.db.doc<user>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      })


  }

  googleLogin(user){
    const provider = new firebase.auth.GoogleAuthProvider();
    user.isOnline = true;
    return this.oAuthLogin(provider);
  }
  oAuthLogin(provider){
    this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      });
  }

  logout(user){
    this.db.collection(`users`).doc(`${user.uid}`).update({isOnline: false});
    //const userRef: AngularFirestoreDocument<user> = this.db.doc(`users/${user.uid}`);
    //userRef.update({isOnline: false});
    return this.afAuth.auth.signOut();
  }

  private updateUserData(user){
    const userRef: AngularFirestoreDocument<user> = this.db.doc(`users/${user.uid}`);

    const data: user = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      isOnline: user.isOnline
    };
    return userRef.set(data);
  }

}
