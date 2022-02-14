import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginService {

  usersCollection: string = "users";

  public status = new BehaviorSubject(false);

  constructor(
    private fireStore: AngularFirestore,
  ) {
    let data = localStorage.getItem('user');
    if (data) {
      this.status.next(true);
    } else {
      this.status.next(false);
    }
  }

  setLoginStatus(status: boolean) {
    this.status.next(status);
  }

  logout() {
    localStorage.clear();
  }

  setLoginData(data: any) {
    let user = JSON.stringify(data);
    localStorage.setItem('user', user)
  }

  getUserData() {
    let data = localStorage.getItem('user');
    if(data) return JSON.parse(data)
  }

  setUserDeviceToken(token) {
    let id = this.getUserData().id;
    
    this.fireStore.collection(this.usersCollection).doc(id).update({
      device_token: token,
    })
    .then(res => {
      console.log('token stored in DB');
    })
    .catch(e => {
      console.log(e);
    })
  }

  getUserDeviceToken(email: any) {
    console.log(email);

    let token = '';

    this.fireStore.collection(this.usersCollection, (ref: { where: (arg0: string, arg1: string, arg2: any) => any; }) => ref.where('email', '==', email)).get().subscribe((res: { docs: any[]; }) => {
      res.docs.forEach((doc) => {
        token = doc.data()['device_token']
        console.log(token);
        return token;
      });
    });

    
  }
}
