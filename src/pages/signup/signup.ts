import{Component} from '@angular/core';
import{NavController, NavParams, AlertController} from 'ionic-angular';
import{AngularFireAuth} from 'angularfire2/auth';
import{AngularFireDatabase} from 'angularfire2/database';
import { MainPage } from '../main/main';

@Component({
    selector:'page-signup',
    templateUrl:'signup.html'
})
export class SignUpPage{
    data: any;

    constructor(public navCtrl:NavController, public navParams:NavParams, public afAuth: AngularFireAuth,
    public afdb:AngularFireDatabase, public alertCtrl: AlertController){
        this.data = {
            user:{
                uid:'',
                email: '',
                password:'',
                username:''
            }
        }
    }
    signUp(){
        this.afAuth.auth.createUserWithEmailAndPassword(this.data.user.email, this.data.user.password)
        .then((success)=> {
            this.data.user.uid = this.afAuth.auth.currentUser.uid;
            this.afdb.object('userPreferences').update({
                [this.data.user.uid]: {
                    username: this.data.user.username,
                    email: this.data.user.email
                }
            });
            this.navCtrl.push(MainPage);
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