import { Component } from '@angular/core';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

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
       this.username = "userNamePlaceHolder"

       this.chatroomID = navParams.get('chatroomID');
}

//update to firebase. it is currently replacing the old "content" with the new content. 
//need to change it so it adds on and does not replace
send(){
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

