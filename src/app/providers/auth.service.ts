import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuario: any = {};

  constructor(public auth: AngularFireAuth) {
    this.auth.authState.subscribe( user => {
      // console.log('Estado del usuario: ', user);

      if (!user) {
          return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
  });
   }

  // tslint:disable-next-line: typedef
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  // tslint:disable-next-line: typedef
  logout() {
    this.usuario = {};
    this.auth.signOut();
  }

}
