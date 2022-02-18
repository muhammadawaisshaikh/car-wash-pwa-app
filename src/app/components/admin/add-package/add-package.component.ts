import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss']
})
export class AddPackageComponent implements OnInit {

  programForm: FormGroup;

  packageCollection: string = "packages";
  categories: any = [];
  data: any = '';
  selectedCategory: any = {};

  preview: any = "assets/img/img-upload-icon.png";
  loading: any = "assets/img/loading.gif";
  percent: number = 0;
  uploadPercent: Observable<any>;
  downloadURL: Observable<string>;
  imageUploaded: boolean = false;

  constructor(
    private router: Router,
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) {
    if (this.router?.getCurrentNavigation()?.extras.state) {
      this.data = this.router.getCurrentNavigation()?.extras?.state?.data;
    }
  }

  ngOnInit(): void {
    this.formInit();
    this.getCategories();

    if (this.data) {
      this.preview = this.data.image;
      this.programForm.patchValue({
        name: this.data.name,
        price: this.data.price,
        category: this.data.category[0].id
      })
    }
  }

  formInit() {
    this.programForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  addPackage() {
    this.fireStore.collection(this.packageCollection).add({
      image: this.preview,
      name: this.programForm.value.name,
      price: this.programForm.value.price,
      category: this.selectedCategory,
    })
    .then(res => {
      // console.log(res);
      this.router.navigateByUrl("/admin/all-packages");
      this.programForm.reset();
    })
    .catch(e => {
      console.log(e);
    })
  }

  onCategorySelect(e: any) {
    let categoryId = e.target.value;
    let category = this.categories.filter((item: any) => item.id == categoryId);
    this.selectedCategory = category
  }

  uploadFile(event: any) {
    this.imageUploaded = !this.imageUploaded;
    
    const file = event.target.files[0];
    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(res => this.percent = res );
    
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(res => {
          this.preview = res;

          this.imageUploaded = !this.imageUploaded;
        });
      })
    )
    .subscribe();
  }

  getCategories() {
    this.fireStore.collection("categories").get().subscribe((res) => {
      res.docs.forEach((doc: any) => {
        let item = {
          id: doc.id,
          image: doc.data()['image'],
          name: doc.data()['name'],
        }
        this.categories.push(item);
      });
    });
  }

  updatePackage() {
    console.log(this.programForm.value);
    
    this.fireStore.collection(this.packageCollection).doc(this.data.id).update({
      image: this.preview,
      name: this.programForm.value.name,
      price: this.programForm.value.price,
      category: this.selectedCategory,
    })
    .then(res => {
      alert('Category Updated');
      this.router.navigateByUrl("/admin/all-packages");
    })
    .catch(e => {
      console.log(e);
    })
  }

}
