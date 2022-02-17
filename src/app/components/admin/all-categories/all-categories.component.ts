import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BackNavigateService } from '../../../core/services/back-navigate/back-navigate.service';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit {

  categoryCollection: string = "categories";
  data: any = [];
  somethingWrong: boolean = false;

  constructor(
    private fireStore: AngularFirestore,
    private backService: BackNavigateService
  ) {}

  ngOnInit(): void {
    this.getCategories();

    setTimeout((item: any) => {
      this.somethingWrong = true;
    }, 5000);
  }

  getCategories() {
    this.fireStore.collection(this.categoryCollection).get().subscribe((res) => {
      res.docs.forEach((doc: any) => {
        
        let item = {
          id: doc.id,
          image: doc.data()['image'],
          name: doc.data()['name'],
        }

        this.data.push(item);
      });
    });    
  }

  deleteCategory(id: any) {
    if (confirm('Delete?')) {
      this.fireStore.collection(this.categoryCollection).doc(id).delete();
      this.data = [];
      this.getCategories();
    }
  }

  backEnabled() {
    this.backService.toggleBackState();
  }

}
