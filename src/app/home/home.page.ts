import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage  {

  public imageList = [];
  public isChange = [];
  
  constructor(public alertController: AlertController, private imagePicker: Camera, private storage: Storage) {
    console.log('Yo constructor');
    storage.get('imageList').then((val) => {
      console.log('Your list is', val);
      if (val != null) {this.imageList = val; }
    });
 
  }

  nw; i; images;
  normalizeUrl = require('normalize-url');
  options = {
    width: 500,
    height: 500,
    quality: 75
  };

  /*public imageList = [
    {subtitle: 'Art',
     title: 'The beauty of Monalisa is the best',
     content: 'Rest',
     state: 'edit',
     // url: 'file:///var/mobile/Containers/Data/Application/C330FA89-5E70-47D0-8443-E0400DF7F6D4/tmp/cdv_photo_024.jpg'
      url: 'https://natgeo.imgix.net/factsheets/thumbnails/MonaLisa.jpg?auto=compress,format&w=1024&h=560&fit=crop'
    },
    {subtitle: 'Nature',
     title: 'Nature and Peace',
     content: 'Rest in natural great peace. Nyoshul Khenpo Rinpoche',
     state: 'view',
     url: 'http://www.addtobucketlist.com/wp-content/uploads/2017/12/hamilton-pool.jpg'}
  ];*/

  async presentAlertConfirm(image: any) {
    const alert = await this.alertController.create({
      header: 'Delete this blog?',
      message: 'This blog will be <strong>erased</strong> comletely!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.imageList.splice(this.imageList.indexOf(image), 1);
            this.storage.set( 'imageList', this.imageList);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentChangeConfirm(i: any) {
    const alert = await this.alertController.create({
      header: 'Change this blog?',
      message: 'You should <strong>review</strong> this blog one more time',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            const subtitleID = 'subtitle' + i;
            const titleID = 'title' + i;
            const contentID = 'content' + i;

            this.imageList[i].subtitle = document.getElementById(subtitleID).innerText;
            this.imageList[i].title = document.getElementById(titleID).innerText;
            this.imageList[i].content = document.getElementById(contentID).innerText;
            this.imageList[i].url = this.imageList[i].presentUrl;
            this.imageList[i].state = 'view';
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentCreateNew() {
    const alert = await this.alertController.create({
      header: 'New blog has been created',
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
          cssClass: 'secondary'
        }
      ]
    });
    await alert.present();
  }

  confirm(i: any) {
    const subtitleID = 'subtitle' + i;
    const titleID = 'title' + i;
    const contentID = 'content' + i;
    if ((this.imageList[i].url !== this.imageList[i].presentUrl)
    || (this.imageList[i].subtitle.toUpperCase() !== document.getElementById(subtitleID).innerText)
    || (this.imageList[i].title !== document.getElementById(titleID).innerText)
    || (this.imageList[i].content !== document.getElementById(contentID).innerText)
    ) {
      console.log(this.imageList[i].subtitle);
      console.log(document.getElementById(subtitleID).innerText);
      console.log(this.imageList[i].subtitle === document.getElementById(subtitleID).innerText);
      this.presentChangeConfirm(i);
    }
    else {
      this.imageList[i].state = 'view';
    }
    this.storage.set( 'imageList', this.imageList);
  }

  config(i: any) {
    this.imageList[i].state = 'edit';
  }

  add() {

    this.nw = {
      subtitle: 'ENTER NEW SUBTITLE',
      title: 'Enter new title',
      content: 'Enter new content',
      state: 'edit',
      url: 'assets/no-image-icon-6.png',
      presentUrl: 'assets/no-image-icon-6.png'
    };

    this.imageList.push(this.nw);
    this.storage.set( 'imageList', this.imageList);
  }

  resize(cl: any, i: any) {

    let element = document.getElementsByClassName(cl)[i] as HTMLElement;
    console.log(element);
    element.style.height = element.scrollHeight + 'px';
  }

  check(i: any, str: string) {

    const subtitle = this.imageList[i].subtitle.toUpperCase();
    const title = this.imageList[i].title.toUpperCase();

    if (str == null) {console.log('get'); return true; }
    str = str.toUpperCase();

    return subtitle.includes(str) || title.includes(str);
  }



 pickImage(i: any) {
  this.imagePicker.getPicture({
      quality: 70,
      destinationType: this.imagePicker.DestinationType.DATA_URL,
      sourceType: this.imagePicker.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
  }).then((results) => {
      this.imageList[i].presentUrl = `data:image/jpeg;base64,` + results;
  }, (error) => {
      // console.log('ERROR -> ' + JSON.stringify(error));
      // alert('ERROR: ' + JSON.stringify(error));
  });
}

}
