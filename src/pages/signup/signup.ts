import{Component} from '@angular/core';
import{NavController, NavParams} from 'ionic-angular';
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
    public afdb:AngularFireDatabase){
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
        this.afAuth.auth.createUserWithEmailAndPassword(this.data.user.email, this.data.user.password);
        this.navCtrl.push(MainPage).then((success)=> {
            this.data.user.uid = this.afAuth.auth.currentUser.uid;
            this.afdb.object('userPreferences').set(this.data.user);
            this.navCtrl.push(MainPage);
        }).catch(
            (err)=>{
                console.log(err);
                this.data.user = '';
                this.data.email = '';
            }
        );
    }
}