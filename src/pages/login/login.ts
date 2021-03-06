import{ Component } from '@angular/core';
import{ NavController, NavParams, AlertController} from 'ionic-angular';
import{AngularFireAuth} from 'angularfire2/auth';
import { MainPage } from '../main/main';
import { WelcomePage } from '../welcome/welcome';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage{
    uid: any;
    data: any
    username: any;
    randomTempID: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
         public afAuth:AngularFireAuth, public alertCtrl: AlertController){
             this.data = {
                user:{
                    email: '',
                    password: ''
                }
            }

            this.randomTempID = Math.floor((Math.random()*10)+1);
    }

    login(){
        this.afAuth.auth.signInWithEmailAndPassword(
            this.data.user.email, this.data.user.password)
            .then((success)=> {
                //grab the displayName of the user's acc. which is the the "first name and lastname" when the user signup              
                this.username = this.afAuth.auth.currentUser.displayName;
                this.uid = this.afAuth.auth.currentUser.uid;
                //pass it as a params
                this.navCtrl.push(WelcomePage, {'username': this.username, 'uid': this.uid, 'randomTempID': this.randomTempID});
                console.log('login: ' + this.uid);
            }).catch(
                (err)=>{
                    let alert = this.alertCtrl.create(({
                        title:'Login Failed',
                        subTitle: err,
                        buttons: ['Dismiss']
                    }));
                    alert.present();
                    this.data.user.email = '';
                    this.data.user.password = '';
                }
            );
    }

    goSignUpPage(){
        this.navCtrl.push(SignUpPage);
    }
}