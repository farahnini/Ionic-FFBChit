import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx/index';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  staffID: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
    private file: File


  ) { 

    // Create the "FFB_CHIT" folder if it doesn't exist
    const mainDir = "file:///storage/self/primary";
    this.file.createDir(mainDir, 'FFB_CHIT', false);

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async validateLogin() {
    this.http.get<any[]>('/assets/json/user.json').subscribe({
      next: (data: any[]) => {
        const validUser = data.find((user: any) => user.userid === this.staffID && user.password === this.password);
  
        if (validUser) {
          console.log('Login successful');
          this.router.navigate(['/home', this.staffID]);
        } else {
          console.log('Invalid staffID or password');
          this.presentToast('Invalid staffID or password');
        }
      },
      error: (err: any) => {
        console.log('Error retrieving user data');
        this.presentToast('ID Petugas atau kala laluan tidak wujud');
      }
    });
  }
  
  

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }



}
