import{ Component } from '@angular/core';
import{ NavController, NavParams, AlertController} from 'ionic-angular';
import{AngularFireAuth} from 'angularfire2/auth';
import { MainPage } from '../main/main';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage{
    data: any

    constructor(public navCtrl: NavController, public navParams: NavParams,
         public afAuth:AngularFireAuth, public alertCtrl: AlertController){
             this.data = {
                user:{
                    email: '',
                    password: ''
        
                }
            }
    }

    login(){
        this.afAuth.auth.signInWithEmailAndPassword(
            this.data.user.email, this.data.user.password)
            .then((success)=> {
                this.navCtrl.push(MainPage);
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
}