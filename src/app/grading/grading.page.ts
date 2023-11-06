import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { File } from '@ionic-native/file/ngx/index';
import { ToastController } from '@ionic/angular';
import { Filesystem, Encoding } from '@capacitor/filesystem';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-grading',
  templateUrl: './grading.page.html',
  styleUrls: ['./grading.page.scss'],
})
export class GradingPage implements OnInit {

  staffID: string = '';
  ladang: string = '';
  peringkat: string = '';
  blok: string = '';
  tarikh: string ='';
  namaPetugasArray: string[] = [];
  isDataAvailable: boolean = false;
  isShowTSV: boolean = false;

  gradingNum:number = 0;
  platform: string;
  masakValue: number;
  mengkalValue: number;
  mudaValue: number;
  kosongValue: number;
  busukValue: number;
  tangkaiValue: number;
  kotorValue: number;
  lamaValue: number;
  seranganValue: number;
  sumGroup1: number = 0;
  sumGroup2: number = 0;

  latitude:number;
  longitude:number

  tsvname:string;
  tsvData: string = "";

  serverUrl:string = 'http://34.133.35.67/ffb_chit/upload_tsv.php';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private file: File,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.staffID = params['staffID'];
      this.ladang = params['ladang'];
      this.peringkat = params['peringkat'];
      this.blok = params['blok'];
      this.tarikh = params['tarikh'];
      this.namaPetugasArray = params['namaPetugasArray'];
    });
  }

  displayTSV() {

  
    const timestamp = Date.now();
    const currentDate = new Date(timestamp);
    const formattedDate = currentDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    console.log(formattedDate);

    const formattedString = this.tarikh.replace(/\//g, '');

    // Get TSV name
    this.tsvname="CHIT_"+formattedString+"_"+this.staffID+".tsv";

    // Retrieve data from TSV
    const directory = 'file:///storage/self/primary/FFB_CHIT/';
    const filedir = directory+this.tsvname;
    const fileContent = Filesystem.readFile({
      path: filedir,
      encoding: Encoding.UTF8,
    })

    fileContent.then(output=>{
      this.tsvData = output.data;

    })

    this.isShowTSV = true;
  }

  closeTSV() {
    this.isShowTSV = false;
  }

  displayData() {
    this.isDataAvailable = true;
  }

  closePopup() {
    this.isDataAvailable = false;
  }

  calculateSums() {
    this.sumGroup1 = (this.masakValue || 0) + (this.mengkalValue || 0);
    this.sumGroup2 = (this.mudaValue || 0) + (this.kosongValue || 0) + (this.busukValue || 0);
  }



  submit(){

  // Set undefined values
  this.platform = this.platform || '';
  this.masakValue = this.masakValue || 0;
  this.mengkalValue = this.mengkalValue || 0;
  this.mudaValue = this.mudaValue || 0;
  this.kosongValue = this.kosongValue || 0;
  this.busukValue = this.busukValue || 0;
  this.tangkaiValue = this.tangkaiValue || 0;
  this.kotorValue = this.kotorValue || 0;
  this.lamaValue = this.lamaValue || 0;
  this.seranganValue = this.seranganValue || 0;

  this.showConfirmation();

  }

  async showConfirmation() {
    const alert = await this.alertController.create({
      header: 'Pengesahan',
      message: `
        <table>
          <tr>
            <td><strong>Ladang</strong></td>
            <td>${this.ladang}</td>
          </tr>
          <tr>
            <td><strong>Peringkat</strong></td>
            <td>${this.peringkat}</td>
          </tr>
          <tr>
            <td><strong>Blok</strong></td>
            <td>${this.blok}</td>
          </tr>
          <tr>
            <td><strong>Platform</strong></td>
            <td>${this.platform}</td>
          </tr>
          <tr>
            <td><strong>Digred oleh</strong></td>
            <td>${this.staffID}</td>
          </tr>
          <tr>
          <td><strong>Penuai</strong></td>
          <td>${this.namaPetugasArray}</td>
        </tr>
        </table>
        <br>
        <p>GRADING BTS</p>
        <table>
          <tr>
            <td><strong>Masak</strong></td>
            <td>${this.masakValue}</td>
          </tr>
          <tr>
            <td><strong>Mengkal</strong></td>
            <td>${this.mengkalValue}</td>
          </tr>
          <tr>
            <td><strong>Muda</strong></td>
            <td>${this.mudaValue}</td>
          </tr>
          <tr>
            <td><strong>Kosong</strong></td>
            <td>${this.kosongValue}</td>
          </tr>
          <tr>
            <td><strong>Busuk</strong></td>
            <td>${this.busukValue}</td>
          </tr>
          <tr>
            <td><strong>Tangkai Panjang</strong></td>
            <td>${this.tangkaiValue}</td>
          </tr>
          <tr>
            <td><strong>Kotor:</strong></td>
            <td>${this.kotorValue}</td>
          </tr>
          <tr>
            <td><strong>Lama/Peram</strong></td>
            <td>${this.lamaValue}</td>
          </tr>
          <tr>
            <td><strong>Serangan Tikus</strong></td>
            <td>${this.seranganValue}</td>
          </tr>
        </table>
      `,
      buttons: [
        {
          text: 'KEMBALI',
          role: 'cancel'
        },
        {
          text: 'SIMPAN',
          handler: () => {
            this.saveToTSVFile();
          }
        }
      ],
    });
  
    await alert.present();
  }

  back(){
    this.router.navigate(['/home', this.staffID]);
  }

  reset(){
    this.masakValue = null;
    this.mengkalValue = null;
    this.mudaValue = null;
    this.kosongValue = null;
    this.busukValue = null;
    this.tangkaiValue = null;
    this.kotorValue = null;
    this.lamaValue = null;
    this.seranganValue = null;
  }
  
  async saveToTSVFile(){

    const coordinates = await Geolocation.getCurrentPosition().then((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);
  
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    const timestamp = Date.now();
    const currentDate = new Date(timestamp);
    const formattedDate = currentDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    console.log(formattedDate);

    const formattedString = this.tarikh.replace(/\//g, '');

    // Name the TSV
    this.tsvname="CHIT_"+formattedString+"_"+this.staffID+".tsv";
    console.log(this.tsvname)

    const finalTSV = `${this.staffID}\t${formattedDate}\t${this.tarikh}\t${this.ladang}\t${this.peringkat}\t${this.blok}\t${this.platform}\t${this.latitude}\t${this.longitude}\t${this.namaPetugasArray}\t${this.masakValue}\t${this.mengkalValue}\t${this.mudaValue}\t${this.kosongValue}\t${this.busukValue}\t${this.tangkaiValue}\t${this.kotorValue}\t${this.lamaValue}\t${this.seranganValue}`;
    console.log(finalTSV)

    // Save the TSV
    const directory = 'file:///storage/self/primary/FFB_CHIT';
    this.file
    .createFile(directory, this.tsvname, true)
    .then(() => {
      this.file
        .writeFile(directory, this.tsvname, finalTSV+ '\n', { append: true, replace: false })
        .then(async success => {
          this.reset();
          console.log('Success:', success);
          const toast = await this.toastController.create({
            message: 'Data BERJAYA disimpan',
            duration: 1000,
            color: 'success'
          });
          toast.present();
          this.gradingNum = this.gradingNum+1;
        })
        .catch(async error => {
          console.error('Error saving file:', error.message);
          const toast = await this.toastController.create({
            message: 'Data TIDAK berjaya disimpan',
            duration: 1000,
            color: 'danger'
          });
          toast.present();
        });
    })
    .catch(async error => {
      console.error('Error creating file:', error.message);
      const toast = await this.toastController.create({
        message: 'Gagal membuat fail',
        duration: 1000,
        color: 'danger'
      });
      toast.present();
    });
  }

    // Method to check the accessibility of the serverUrl
    checkServerAccessibility() {
      this.http.get(this.serverUrl).subscribe(
        (response) => {
          console.log('Server is accessible:', response);
        },
        (error) => {
          console.error('Error accessing server:', error);
        }
      );
  }

  sync() {
    const directory = 'file:///storage/self/primary/FFB_CHIT/';

    this.checkServerAccessibility();

    this.uploadFilesFromDirectory(directory)
      .then(async (uploadResults: boolean[]) => {
        const allFilesUploaded = uploadResults.every(result => result);
        const message = allFilesUploaded ? 'Data BERJAYA dimuat naik' : 'Data TIDAK berjaya dimuat naik';
        
        const toast = await this.toastController.create({
          message: message,
          duration: 1000,
          color: allFilesUploaded ? 'success' : 'danger'
        });
        toast.present();
      })
      .catch(async (error) => {
        console.error(error.message);
        const toast = await this.toastController.create({
          message: 'Data TIDAK berjaya dimuat naik',
          duration: 1000,
          color: 'danger'
        });
        toast.present();
      });
  }
  
  async uploadFilesFromDirectory(directoryPath: string): Promise<boolean[]> {
    const files = await Filesystem.readdir({
      path: directoryPath,
    });
    console.log(files);
  
    const uploadPromises = files.files
      .filter(file => file.type === 'file')
      .map(async file => {
        const filePath = `${directoryPath}/${file.name}`;
        console.log(filePath);
        const fileData = await Filesystem.readFile({
          path: filePath,
          encoding: Encoding.UTF8
        });
  
        try {
          await this.uploadFile(filePath, fileData.data);
          console.log(`File ${filePath} uploaded successfully.`);
          return true; // Upload succeeded
        } catch (error:any) {
          console.error(error.message);
          console.log(`File ${filePath} upload failed.`);
          return false; // Upload failed
        }
      });
  
    return Promise.all(uploadPromises);
  }
  
  private async uploadFile(filePath: string, fileData: string): Promise<void> {
    const formData = new FormData();
    const blob = new Blob([fileData], { type: 'text/plain' });
    formData.append('file', blob, filePath);
  
    console.log(formData.get('file'));
    console.log('File being sent:', filePath);
  
    try {
      const response = await this.http.post(this.serverUrl, formData).toPromise();
      console.log(response); // Log the response object to check its structure
    } catch (error:any) {
      console.error(error.message);
      throw new Error(`Error uploading file. Message: ${error.message}`);
    }
  }
  
  
}
