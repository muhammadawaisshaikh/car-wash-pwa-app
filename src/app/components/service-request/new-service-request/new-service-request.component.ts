import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CheckLoginService } from '../../../core/services/check-login/check-login.service';
import { PackagesService } from '../../../core/services/packages/packages.service';

@Component({
  selector: 'app-new-service-request',
  templateUrl: './new-service-request.component.html',
  styleUrls: ['./new-service-request.component.scss']
})
export class NewServiceRequestComponent implements OnInit {

  programForm: FormGroup;
  step: number = 1;
  serviceRequestCollection: string = "service-requests";
  loginStatus: boolean = false;

  categoryData: any = [];
  packagesData: any = [];

  selectedCategory: any = '';
  selectedPackage: any = '';

  constructor(
    private router: Router,
    private fireStore: AngularFirestore,
    private fb: FormBuilder,
    private packageService: PackagesService,
    private checkLogin: CheckLoginService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.ifLogin();

    if (this.loginStatus) {
      this.programForm.patchValue({
        fullName: this.checkLogin.getUserData().name,
        mobile: this.checkLogin.getUserData().contact
      })
    }
  }

  formInit() {
    this.programForm = this.fb.group({
      fullName: ['', Validators.required],
      mobile: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      package: ['', Validators.required],
      datetime: ['', Validators.required],
      payment: ['', Validators.required],
    });
  }

  next() {
    if (this.step < 2) {
      this.step += 1;
    }
  }

  back() {
    if (this.step == 2) {
      this.step -= 1;
    }
  }

  getUserData() {
    return this.checkLogin.getUserData();
  }

  // Status Types
  // 0 - Request Received
  // 1 - Arrived at Destination
  // 2 - Service Done
  // 3 - Payment Recieved
  serviceRequest() {
    if (this.programForm.status == 'VALID') {
      this.fireStore.collection(this.serviceRequestCollection).add({
        user: this.getUserData(),
        location: this.programForm.value.location,
        category: this.selectedCategory,
        package: this.selectedPackage,
        datetime: this.programForm.value.datetime,
        payment: this.programForm.value.payment,
        detailer: 'not-assigned',
        status: 0
      })
      .then(res => {
        // console.log(res);
        this.router.navigateByUrl("/service-request");
        this.programForm.reset();
      })
      .catch(e => {
        console.log(e);
      })
    } else {
      alert('Please provide all required details.');
    }
  }

  getCategory(data: any) {
    this.selectedCategory = data;
    this.packageService.setCategory(this.selectedCategory);
  }

  getPackage(data: any) {
    this.selectedPackage = data;
  }

  ifLogin() {
    this.checkLogin.status.subscribe(res => {
      this.loginStatus = res;

      console.log(this.loginStatus);
      
      
      if (!this.loginStatus) {
        this.router.navigateByUrl('/auth/login');
      }
    })
  }

}
