import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  staffID: string = '';
  ladang: string = ''; 
  peringkat: string = '';
  blok: string = '';
  namaPetugasArray: string[] = ['']; // Initialize with one empty element

  date:Date = new Date();

  ladangOptions: string[] = [];
  peringkatOptions: string[] = [];
  namaPetugasOptions: string[] = ['worker A', 'worker B', 'worker C', 'worker D', 'worker E'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private file: File
  ) {

    const staffIDParam = this.route.snapshot.paramMap.get('staffID');
    this.staffID = staffIDParam !== null ? staffIDParam : '';
    this.fetchLadangOptions();

  }


  fetchLadangOptions() {
    this.http.get<any[]>('assets/json/peringkat.json').subscribe((data: any[]) => {
      this.ladangOptions = [...new Set(data.map(item => item.LADANG))].sort();
    });
  }
  
  fetchPeringkatOptions() {
    this.http.get<any[]>('assets/json/peringkat.json').subscribe((data: any[]) => {
      const filteredData = data.filter(item => item.LADANG === this.ladang);
      this.peringkatOptions = [...new Set(filteredData.map(item => item.PERINGKAT.toString()))].sort();
    });
  }
  

  onLadangChange() {
    this.fetchPeringkatOptions();
  }

  addNamaPetugas() {
    this.namaPetugasArray.push('');
  }

  deleteNamaPetugas(index: number) {
    this.namaPetugasArray.splice(index, 1);
  }
  
  

  isFormValid(){
    return this.ladang && this.peringkat && this.blok;
  }


  submitForm() {

      const date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      
      const dateString = `${day}/${month}/${year}`;

      // Navigate to the grading page and pass the data as route parameters
      this.router.navigate(['/grading'], {
        queryParams: {
          staffID: this.staffID,
          ladang: this.ladang,
          peringkat: this.peringkat,
          blok: this.blok,
          tarikh: dateString,
          namaPetugasArray: this.namaPetugasArray
        }
      });

  }

}
