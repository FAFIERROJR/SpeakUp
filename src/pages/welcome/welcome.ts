import{Component} from '@angular/core'
import{NavController, NavParams} from 'ionic-angular'
import { NavGroup } from 'ionic-angular/navigation/nav-util'
import{LoginPage} from '../login/login'
import{SignUpPage} from '../signup/signup'
import{TestingPage} from '../testing/testing'
import { HelloIonicPage } from '../hello-ionic/hello-ionic';

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

    goTestPage(){
        this.navCtrl.push(TestingPage);
    }

    goHelloIonicPage(){
        this.navCtrl.push(HelloIonicPage);
    }
}