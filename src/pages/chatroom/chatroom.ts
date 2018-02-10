import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { WelcomePage } from '../welcome/welcome';
import {Comment} from '../../models/comment';
import firebase from 'firebase'

/**
 * Generated class for the ChatroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {
  randomTempID: any;
  @ViewChild('scrollMe') private commentsGrid: ElementRef;
  disableScrollDown = false;
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
  arrayOfWords: Array<any>;
  doesNotContainProfanity: boolean;
  uid: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth:AngularFireAuth,public afdb:AngularFireDatabase, public alertCtrl: AlertController){
        this.data = {
           input:{
               content: ''
           }
       };
       
       this.chatroomID = navParams.get('chatroomID');
       this.chatroomRef = this.afdb.list('chatrooms/' + this.chatroomID + '/comments');
       this.username = afAuth.auth.currentUser.displayName;
       this.serverTime = firebase.database.ServerValue.TIMESTAMP; //get the firebase server time and stamp it
       this.uid = navParams.get('uid');
       this.randomTempID = navParams.get('randomTempID');
       
       console.log('testing: ' + this.uid);
       //the array of bad words. 
       this.arrayOfWords = ['fuck','shit','damn','bitch'];
       this.doesNotContainProfanity = true;
       
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
    let newComment = new Comment();
    newComment.username =  this.username;
    newComment.content = this.data.input.content;//the input's value using ngmodel
    newComment.server_time = this.serverTime; //the firebase's server time
    newComment.user_date = this.userDate; //user's system's date
    newComment.user_time = this.userTime; //user's system's time
    newComment.points = 0;

    //obtain the key when the new comment is push
    this.uniqueKey = this.chatroomRef.push(newComment).key;

    //using that key, find the comment with that key and update the key as one of its properity to be use later on
    this.afdb.object('chatrooms/' + this.chatroomID + '/comments/' + this.uniqueKey).update({
      commentKey: this.uniqueKey
    })
    
    this.data.input.content = '';
    this.disableScrollDown = false;
    this.scrollToBottom();  
  }

  /**
   * scroll to the latest message on the very bottom of the chat on load
   */
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /**
   * When scroll back to top 
   */
  onScroll() {
    let element = this.commentsGrid.nativeElement
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
    if (this.disableScrollDown && atBottom) {
        this.disableScrollDown = false;
    } else {
        this.disableScrollDown = true;
    }
  }

  /**
   * scroll to bottom
   */
  scrollToBottom(): void{
    if (this.disableScrollDown) {
      return
    }
    else{
      try {
        this.commentsGrid.nativeElement.scrollTop = this.commentsGrid.nativeElement.scrollHeight;
      } catch(err) { }
    }
  }

  /**
   * check the input with the array of words. if there is a match between the array of words and the input than alert, else let them send.
   */
  checkProfanity() {
    for(var i = 0; i < this.arrayOfWords.length; i++){
      if(this.data.input.content.indexOf(this.arrayOfWords[i]) != -1){
        let alert = this.alertCtrl.create(({
          title:'Profanity Alert',
          subTitle: "Your comment contains profanity. Please remove it.",
          buttons: ['Dismiss']
        }));
        alert.present();
        this.doesNotContainProfanity = false;
        console.log(this.data.input.content.indexOf(this.arrayOfWords[i]));
        return;
      }
      else{
        console.log(this.data.input.content.indexOf(this.arrayOfWords[i]));
        
        this.doesNotContainProfanity = true;
      }
    }

     if(this.doesNotContainProfanity){
       this.send();
     }
  }
  /**
   * signout
   */
  signOut(): void {
    this.afAuth.auth.signOut();
    this.navCtrl.push(WelcomePage);
}


}
