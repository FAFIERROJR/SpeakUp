import{Component} from '@angular/core';
import{NavController, NavParams} from 'ionic-angular';
import{AngularFireAuth} from 'angularfire2/auth';

@Component({
    selector:'page-signup',
    templateUrl:'signup.html'
})
export class SignUpPage{
    data: any;

    constructor(public navCtrl:NavController, public navParams:NavParams, public afAuth: AngularFireAuth){
        this.data = {
            user:{
                email: '',
                password:'',
            }
        }
    }
    signUp(){
        this.afAuth.auth.createUserWithEmailAndPassword(this.data.user.email, this.data.user.password);
    }
}