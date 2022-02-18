import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BackNavigateService } from '../../../core/services/back-navigate/back-navigate.service';

@Component({
  selector: 'app-all-packages',
  templateUrl: './all-packages.component.html',
  styleUrls: ['./all-packages.component.scss']
})
export class AllPackagesComponent implements OnInit {

  packageCollection: string = "packages";
  data: any = [];
  somethingWrong: boolean = false;

  constructor(
    private fireStore: AngularFirestore,
    private backService: BackNavigateService
  ) {}

  ngOnInit(): void {
    this.getPackages();

    setTimeout((item: any) => {
      this.somethingWrong = true;
    }, 5000);
  }

  getPackages() {
    this.fireStore.collection(this.packageCollection).get().subscribe((res) => {
      res.docs.forEach((doc: any) => {

        let item = {
          id: doc.id,
          image: doc.data()['image'],
          name: doc.data()['name'],
          price: doc.data()['price'],
          category: doc.data()['category'],
        }

        this.data.push(item);
      });
    });
  }

  deletePackage(id: any) {
    if (confirm('Delete?')) {
      this.fireStore.collection(this.packageCollection).doc(id).delete();
      this.data = [];
      this.getPackages();
    }
  }

  backEnabled() {
    this.backService.toggleBackState();
  }

}
