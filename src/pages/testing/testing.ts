import { Component } from '@angular/core';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { firebaseConfig } from '../../app/app.module';


@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html'
})

export class TestingPage {
  data:any;
  chatroomID : any;
  username: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth:AngularFireAuth,public afdb:AngularFireDatabase, public alertCtrl: AlertController){
        this.data = {
           input:{
               content: ''
           }
       };
       this.chatroomID = navParams.get('chatroomID');
}

//uses system's time, need to change to server's time. 
send(){
  let dateTime = new Date();

  this.username = "userNamePlaceHolder: " + dateTime;

  this.afdb.object('chatrooms/' + this.chatroomID + '/comments').update({
    [this.username]: {
      content: this.data.input.content
    }
  });

  this.data.input.content = '';
}


ionViewDidLoad() {
  console.log('ionViewDidLoad ChatroomPage');
}
  
}

