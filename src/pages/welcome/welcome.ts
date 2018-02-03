import{Component} from '@angular/core'
import{NavController, NavParams, AlertController} from 'ionic-angular'
import { NavGroup } from 'ionic-angular/navigation/nav-util'
import{LoginPage} from '../login/login'
import{SignUpPage} from '../signup/signup'
import{TestingPage} from '../testing/testing'
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { ChatroomPage } from '../chatroom/chatroom';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { NewPage } from '../new/new';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
    selector: 'page-Welcome',
    templateUrl:'welcome.html'
})
export class WelcomePage{
    username: any;
    data: any;

    constructor(public navCtrl:NavController, public navParams: NavParams, public afAuth:AngularFireAuth, public alertCtrl: AlertController){
        this.username = navParams.get('username');
        
         if(this.username === undefined){
            //makes it easier to access the chatroom when developing, but need to login once. 
            this.username = "admin";
        }

    }

    goLoginPage(){
        this.navCtrl.push(LoginPage);
    }
    goSignUpPage(){
        this.navCtrl.push(SignUpPage);
    }

    goTestPage(){
        // /**Create an alert when the user is not sign in and accessing chat */
        // if(this.username == undefined){
        //     let alert = this.alertCtrl.create(({
        //         title:'Access Denied',
        //         subTitle: "Please login to use chat.",
        //         buttons: ['Dismiss']
        //     }));
        //     alert.present();
        // }
        // else{
        //     this.navCtrl.push(TestingPage, {'chatroomID': 1, 'username': this.username})
        // }
        
        this.navCtrl.push(TestingPage, {'chatroomID': 1, 'username': this.username})
        
    }

    goHelloIonicPage(){
        this.navCtrl.push(HelloIonicPage);
    }

    goChatroomPage(){
        if(this.username == undefined){
            let alert = this.alertCtrl.create(({
                title:'Access Denied',
                subTitle: "Please login to use chat.",
                buttons: ['Dismiss']
            }));
            alert.present();
        }
        else{
            this.navCtrl.push(ChatroomPage, {'chatroomID': 0});
        }
    }

    goNewPage(){
        this.navCtrl.push(NewPage);
    }

    signOut(): void {
        this.afAuth.auth.signOut(); 
        this.navCtrl.push(LoginPage);
    }
}