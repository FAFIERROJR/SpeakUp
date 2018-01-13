import{Component} from '@angular/core'
import{NavController, NavParams} from 'ionic-angular'
import { NavGroup } from 'ionic-angular/navigation/nav-util';
import{LoginPage} from '../login/login'
import{SignUpPage} from '../signup/signup'

@Component({
    selector: 'page-Welcome',
    templateUrl:'welcome.html'
})
export class WelcomePage{
    constructor(public navCtrl:NavController, public navParams: NavParams){

    }

    goLoginPage(){
        this.navCtrl.push(LoginPage);
    }
    goSignUpPage(){
        this.navCtrl.push(SignUpPage);
    }
}