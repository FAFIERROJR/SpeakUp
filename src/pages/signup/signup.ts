import{Component} from '@angular/core';
import{NavController, NavParams, AlertController} from 'ionic-angular';
import{AngularFireAuth} from 'angularfire2/auth';
import{AngularFireDatabase} from 'angularfire2/database';
import { MainPage } from '../main/main';
import { WelcomePage } from '../welcome/welcome';

@Component({
    selector:'page-signup',
    templateUrl:'signup.html'
})
export class SignUpPage{
    uid: any;
    data: any;
    username: any;
    makeUsername: string;
    constructor(public navCtrl:NavController, public navParams:NavParams, public afAuth: AngularFireAuth,
    public afdb:AngularFireDatabase, public alertCtrl: AlertController){
        this.data = {
            user:{
                uid:'',
                firstname:'',
                lastname:'',
                campusid:'',
                email: '',
                password:''
            }
        }
    }
    signUp(){
        this.afAuth.auth.createUserWithEmailAndPassword(this.data.user.email, this.data.user.password)
        .then((success)=> {
            this.data.user.uid = this.afAuth.auth.currentUser.uid;
            //make the user name the same as the firstname and lastname
            this.username = this.data.user.firstname + " " + this.data.user.lastname;
            //update the display with the firstname and lastname
            this.afAuth.auth.currentUser.updateProfile({
                displayName: this.username,
                photoURL: ""
            }).then((success)=> {
                //do something
            });
            
            this.afdb.object('userProfile').update({
                [this.data.user.uid]: {
                    uid: this.afAuth.auth.currentUser.uid,
                    firstname: this.data.user.firstname,
                    lastname: this.data.user.lastname,
                    campusid: this.data.user.campusid,
                    username: this.username,
                    email: this.data.user.email
                }
            });
            this.navCtrl.push(WelcomePage, {'username': this.username, 'uid': this.data.user.uid});

        }).catch(
            (err)=>{
                let alert = this.alertCtrl.create({
                    title:'Sign Up Failed',
                    subTitle: err,
                    buttons: ['Dismiss']
                });
                alert.present();
                this.data.user.email = '';
                this.data.user.password = '';
            }
        );

    }
}