import { Component, ViewChild, ElementRef } from '@angular/core';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { firebaseConfig } from '../../app/app.module';
import firebase from 'firebase';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html'
})

export class TestingPage{
  item: any;
  chatroomRef: any;
  data: any;
  chatroomID : any;
  username: any;
  serverTime: any;
  messageDate: any;
  userDate: any;
  userTime: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth:AngularFireAuth,public afdb:AngularFireDatabase, public alertCtrl: AlertController){
        this.data = {
           input:{
               content: ''
           }
       };
       
       this.chatroomID = navParams.get('chatroomID');
       this.chatroomRef = this.afdb.list('chatrooms/' + this.chatroomID + '/comments');
       this.username = "get_username"
       this.serverTime = firebase.database.ServerValue.TIMESTAMP; //get the firebase server time
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

    //get the user's system time and convert it
    let systemDate = new Date();
    this.userDate = systemDate.toLocaleDateString();
    this.userTime = systemDate.toLocaleTimeString();
  
    /**
     * This pushes each comment to the database in chronological order
     */
    this.chatroomRef.push({
        username: this.username,
        content: this.data.input.content,
        server_time: this.serverTime,
        user_date: this.userDate,
        user_time: this.userTime
    });
    
    //this.scrollToBottom();
    //clears the inputbox
    this.data.input.content = '';
  }

  /**
   * this generates an uid for the comments as a properity
   */
  // send(){
  //   this.myRef = firebase.database().ref().push();
  //   this.uniqueKey = this.myRef.key;
  //   /**
  //    * This pushes each comment to the database in chronological order
  //    */
  //  let newComment = {
  //                       commentKey: this.uniqueKey,
  //                       username: this.username,
  //                       content: this.data.input.content,
  //                       server_time: this.serverTime,
  //                       user_date: this.userDate,
  //                       user_time: this.userTime
  //                   };

  //   this.chatroomRef.push(newComment);
  // }

  /**
   * scroll to the latest message on the very bottom of the chat
   */
  // ngOnInit(){
  //   this.scrollToBottom();
  //   console.log('ngOnInit ChatroomPage');
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ChatroomPage');
  // }
    
  // scrollToBottom(): void {
  //   try {
  //       this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  //   } catch(err) { }                 
  // }

}

