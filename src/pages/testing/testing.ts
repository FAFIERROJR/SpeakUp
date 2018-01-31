import { Component } from '@angular/core';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { firebaseConfig } from '../../app/app.module';
import firebase from 'firebase';

@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html'
})

export class TestingPage {
  item: any;
  chatroomRef: any;
  data:any;
  chatroomID : any;
  username: any;
  dateTime: any;
  messageDate: any;
  commentPoints:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth:AngularFireAuth,public afdb:AngularFireDatabase, public alertCtrl: AlertController){
        this.data = {
           input:{
               content: ''
           }
       };
       
       this.chatroomID = navParams.get('chatroomID');
       this.chatroomRef = this.afdb.list('chatrooms/' + this.chatroomID + '/comments');
       this.username ="get_username";
       this.dateTime = firebase.database.ServerValue.TIMESTAMP; //get the firebase server time
       this.commentPoints = "get_points";
}

send(){
  // let dateTime = new Date();//this give a timestamp like Tue Jan 30 2018 01:31:17 GMT-0800 (PST) 
  // let dateTime = Date.now();
  // this.username = dateTime + ": " + "userNamePlaceHolder";
 
  // //update the comments inside the chatroom 0 database.
  // this.afdb.object('chatrooms/' + this.chatroomID + '/comments').update({
  //   [this.username]: {
  //       content: this.data.input.content
  // }
  // });

  /**
   * This pushes each comment to the database in chronological order
   */
  this.chatroomRef.push({
      username: this.username,
      content: this.data.input.content,
      date: this.dateTime,
      points: this.commentPoints
  });

  //clears the inputbox
  this.data.input.content = '';
}


ionViewDidLoad() {
  console.log('ionViewDidLoad ChatroomPage');
}
  
}

