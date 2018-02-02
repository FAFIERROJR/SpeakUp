import { Component, ViewChild, ElementRef } from '@angular/core';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { firebaseConfig } from '../../app/app.module';
import firebase from 'firebase';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html'
})

export class TestingPage{
  uniqueKey: string;
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
       this.serverTime = firebase.database.ServerValue.TIMESTAMP; //get the firebase server time and stamp it
    }

  /**
   * When the send button is clicked, push a new comment with its content and properties
   */
  send(){
    //create a new date object using the user's system time. Using system's date for (user's might be in different location)
    let systemDate = new Date();
    this.userDate = systemDate.toLocaleDateString();//convert the date to mm/dd/yyyy
    this.userTime = systemDate.toLocaleTimeString();//convert the time to 12 hours 
    
    //new comment's property
    let newComment = {
      username: this.username,
      content: this.data.input.content,//the input's value using ngmodel
      server_time: this.serverTime, //the firebase's server time
      user_date: this.userDate, //user's system's date
      user_time: this.userTime, //user's system's time
      points: 0
    };

    //obtain the key when the new comment is push
    this.uniqueKey = this.chatroomRef.push(newComment).key;

    //using that key, find the comment with that key and update the key as one of its properity to be use later on
    this.afdb.object('chatrooms/' + this.chatroomID + '/comments/' + this.uniqueKey).update({
      commentKey: this.uniqueKey
    })

    //clear the input box using ngmodel
    this.data.input.content = '';
  }

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

