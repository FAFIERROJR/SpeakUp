import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChatroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {

  chatroomID : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.chatroomID = navParams.get('chatroomID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatroomPage');
  }
  
  

}
