import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import * as firebase from "firebase/app";
import { user } from '../models/user';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService {

  user: Observable<user>;
  avaliable: Observable<user[]>

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

  googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }
  oAuthLogin(provider){
    this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      });
  }

  updateUserStatus(user){
    if(user.isOnline){
      this.db.collection('users').doc(user.uid).update({isOnline: false});
    }
    else{
      this.db.collection('users').doc(user.uid).update({isOnline: true});
    }
  }

  logout(){
    return this.afAuth.auth.signOut();
  }

  private updateUserData(user){
    const userRef: AngularFirestoreDocument<user> = this.db.doc(`users/${user.uid}`);

    const data: user = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      isOnline: user.isOnline = true
    };
    return userRef.set(data);
  }

  viewOnlineUsers(){
    this.avaliable = this.db.collection('users', ref => ref.where('isOnline', '==', true)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as user;
        data.uid = a.payload.doc.id;
        return data;
      });
    });
    return this.avaliable;
  }
}
