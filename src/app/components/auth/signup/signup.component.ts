import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  programForm: FormGroup;
  usersCollection: string = "users";
  loadingImg: any = "assets/img/loading.gif";
  loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fireStore: AngularFirestore,
    private auth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.programForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      contact: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signup() {
    this.loader = true;

    // making authentic account for detailer in Database
    this.auth.createUserWithEmailAndPassword(this.programForm?.value.email, this.programForm?.value.password)
      .then((value: any) => {
        console.log('Success!', value);

        // adding detailer to firestore for user_type and other profile biodata
        this.fireStore.collection(this.usersCollection).add({
          image: 'https://i.ibb.co/2MH630J/user.png',
          name: this.programForm?.value.name,
          email: this.programForm?.value.email,
          contact: this.programForm?.value.contact,
          user_type: 'user',
        })
        .then((res: any) => {
          console.log(res);
          this.loader = false;
          this.router.navigateByUrl("/auth/login");
          this.programForm?.reset();
        })
        .catch((e: any) => {
          console.log(e);
        })
      })
      .catch((err: any) => {
        console.log('Something went wrong: ',err.message);
      });
  }

}
