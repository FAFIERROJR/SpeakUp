import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from '../../models/user'
import {AngularFireAuth} from 'angularfire2/auth'
import {AngularFireDatabase} from 'angularfire2/database'
import {FormsModule} from '@angular/forms'
import { WelcomePage } from '../welcome/welcome';
import { NgForm } from '@angular/forms/src/directives/ng_form';

/**
 * Generated class for the Signup2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup2',
  templateUrl: 'signup2.html',
})
export class Signup2Page {
  user: User
  password: string

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase) {
      /**
       * instantiate user obj
       */
      this.user = new User();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup2Page');
  }

  signup(){
    /**
     * create an Authentication object and sign up user
     * create a userProfile entry
     */
    this.afAuth.auth
      .createUserWithEmailAndPassword(this.user.email, this.password)
        .then((success) => {
          /** grab the uid from auth
           * and assign it to user obj
           */
          this.user.uid = this.afAuth.auth.currentUser.uid;
           /**
           * create user profile entry
           */
          this.createProfile();

          /**
           * update user profile with uid from auth obj
           * and update display name
           */
          this.afAuth.auth.currentUser.updateProfile({
            displayName: this.user.username,
            photoURL: ""
          });

          /**
           * navigate to welcome page
           */
          this.navCtrl.push(WelcomePage);
        })
        .catch((err) => {
          /**
           * on failure:
           * display error message alert dialog
           */
          alert(err);
        });
  }

  createProfile(){
    /**
     * create a reference to userProfile database directory
     */
    let userProfileDBRef = this.afDB.object('userProfile');

    /**
     * push user object to userProfile
     */
    userProfileDBRef.update({
      /**
       * use the uid as the key
       * and the user object as the value
       */
      [this.user.uid] : this.user
    })
  }

}
